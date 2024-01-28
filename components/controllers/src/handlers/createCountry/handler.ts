import '@abraham/reflection';
import { TypeORMCountryRepository } from 'core/infra/adapters/country.repository';
import { CreateCountryUseCase } from 'core/use-cases/createCountry';
import { registerDb } from 'core/infra/database/connection';
import { container } from 'tsyringe';
import { Token } from 'core/constant';
import { Request, Response } from 'express';

registerDb();

container.register(Token.CountryRepository, TypeORMCountryRepository);

export const handle = async (req: Request, res: Response) => {
  const useCase = container.resolve(CreateCountryUseCase);
  await useCase.handle(req.body);
  return res.send('ok');
};
