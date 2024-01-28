import { container } from 'tsyringe';
import { DataSource, Migration } from 'typeorm';

export async function runMigrations(): Promise<Migration[]> {
  return await container.resolve(DataSource).runMigrations();
}

export async function revertLastMigration() {
  return await container.resolve(DataSource).undoLastMigration();
}
