import { z } from 'zod';

export const CREATE_COUNTRY_SCHEMA = z.strictObject({
  countryName: z.string().min(3).max(50),
});

export type CreateCountry = z.input<typeof CREATE_COUNTRY_SCHEMA>;
export type CreateCountryTransformed = z.output<typeof CREATE_COUNTRY_SCHEMA>;
