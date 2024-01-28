import { CountryEntity } from './entities/country.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Initial1706461924113 } from './migrations/1706461924113-Initial';

export type DBPoolConfig = {
  max: number;
  idleTimeoutMillis: number;
};

export function getDbConfig(
  logger?: PostgresConnectionOptions['logger'],
  poolConfig?: DBPoolConfig
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 5432,
    synchronize: false,
    entities: [CountryEntity],
    migrations: [Initial1706461924113],
    logging: true,
    logger,
    ssl: process.env.DATABASE_HOST !== 'localhost',
    extra: poolConfig,
  };
}

export default getDbConfig();
