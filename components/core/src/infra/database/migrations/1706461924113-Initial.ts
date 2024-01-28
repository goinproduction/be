import { SqlReader } from 'node-sql-reader';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as path from 'path';

export class Initial1706461924113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await SqlReader.runSqlFileAsync(
      path.join(__dirname, './up/1706461924113-Initial.sql'),
      queryRunner.query.bind(queryRunner)
    );
  }

  public async down(): Promise<void> {
    throw new Error('Migration down operation not supported');
  }
}
