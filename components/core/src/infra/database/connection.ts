import { Logger } from 'winston';
import { container, instanceCachingFactory } from 'tsyringe';
import { DataSource, EntityManager } from 'typeorm';
import { DBPoolConfig, getDbConfig } from './config';
import { DbAuditLogger } from './logger';
import { Token } from '../../constant';
import { IsolationLevel as TypeORMIsolationLevel } from 'typeorm/driver/types/IsolationLevel';

class CustomDataSource extends DataSource {
  waitForInitDataSource?: Promise<void>;
}

export function registerDb() {
  registerDataSource({ max: 1, idleTimeoutMillis: 100 });
  registerEntityManager();
}

export function registerDbMigrations() {
  registerDataSource();
  registerEntityManager();
}

function registerDataSource(poolConfig?: DBPoolConfig) {
  container.register(DataSource, {
    useFactory: instanceCachingFactory(
      () =>
        new CustomDataSource(
          getDbConfig(
            new DbAuditLogger(container.resolve(Token.Logger)),
            poolConfig
          )
        )
    ),
  });
}

function registerEntityManager(): void {
  container.register(EntityManager, {
    useFactory: instanceCachingFactory(
      (innerContainer) => innerContainer.resolve(DataSource).manager
    ),
  });
}

export type IsolationLevel =
  | 'SERIALIZABLE'
  | 'READ_UNCOMMITTED'
  | 'READ_COMMITTED'
  | 'REPEATABLE_READ';
export const IsolationLevels: Record<IsolationLevel, TypeORMIsolationLevel> = {
  SERIALIZABLE: 'SERIALIZABLE',
  READ_UNCOMMITTED: 'READ UNCOMMITTED',
  READ_COMMITTED: 'READ COMMITTED',
  REPEATABLE_READ: 'REPEATABLE READ',
};

export async function withTransaction<T>(
  work: () => Promise<T>,
  isolationLevel: TypeORMIsolationLevel = IsolationLevels.SERIALIZABLE
): Promise<T> {
  const queryRunner = container.resolve(DataSource).createQueryRunner();
  container.register(EntityManager, { useValue: queryRunner.manager });
  await queryRunner.connect();
  await queryRunner.startTransaction(isolationLevel);

  try {
    const result = await work();
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    registerEntityManager();
  }
}

export async function establishDbConnection(logger: Logger) {
  const dataSource = container.resolve(DataSource) as CustomDataSource;

  if (dataSource.waitForInitDataSource) {
    logger.info('Already init data source in other invocation');
    await dataSource.waitForInitDataSource;
  }

  if (!dataSource.isInitialized) {
    logger.info('Initializing new data source');
    dataSource.waitForInitDataSource = new Promise((resolve, reject) => {
      dataSource
        .initialize()
        .then(() => resolve())
        .catch(reject)
        .finally(() => {
          dataSource.waitForInitDataSource = undefined;
        });
    });
    await dataSource.waitForInitDataSource;
  }
}

export async function closeDbConnection(logger?: Logger) {
  const dataSource = container.isRegistered(DataSource)
    ? container.resolve(DataSource)
    : undefined;
  if (dataSource?.isInitialized) {
    logger?.info('Closing all connections in the db pool');
    await dataSource?.destroy();
  }
}
