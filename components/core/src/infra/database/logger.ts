import { Logger } from 'winston';
import { Logger as TypeOrmLogger } from 'typeorm';

export class DbAuditLogger implements TypeOrmLogger {
  constructor(private readonly logger: Logger) {}

  logQuery(query: string, parameters: unknown[] = []): void {
    this.logger.debug('executing query', { sql: query, values: parameters });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters: unknown[] = []
  ): void {
    this.logger.error('query execution produced an error', {
      sql: query,
      values: parameters,
      error,
    });
  }

  logQuerySlow(time: number, query: string, parameters: unknown[] = []): void {
    this.logger.warn('query execution was slow', {
      sql: query,
      values: parameters,
      time,
    });
  }

  logSchemaBuild(message: string): void {
    this.logger.info(`schema build: ${message}`);
  }

  logMigration(message: string): void {
    this.logger.info(`migration: ${message}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(level: 'warn' | 'info' | 'log', message: any): void {
    this.logger[level](message);
  }
}
