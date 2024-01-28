import { CountryRepository } from '../../domain/ports/country.repository';
import { container, injectable } from 'tsyringe';
import { EntityManager, Repository } from 'typeorm';
import { CountryEntity } from '../database/entities/country.entity';
import { Country } from '../../domain/country';

@injectable()
export class TypeORMCountryRepository implements CountryRepository {
  private get providedRepo(): Repository<CountryEntity> {
    return container.resolve(EntityManager).getRepository(CountryEntity);
  }
  async create(country: Country) {}
}
