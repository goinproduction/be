import { injectable, inject } from 'tsyringe';
import { Token } from '../constant';
import { CountryRepository } from '../domain/ports/country.repository';
import { Country } from '../domain/country';

@injectable()
export class CreateCountryUseCase {
  constructor(
    @inject(Token.CountryRepository)
    private readonly countryRepo: CountryRepository
  ) {}
  async handle(country: Country) {
    await this.countryRepo.create(country);
  }
}
