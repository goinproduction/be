import { Country } from '../country';

export interface CountryRepository {
  create(country: Country): Promise<void>;
}
