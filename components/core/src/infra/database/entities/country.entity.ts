import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryColumn({ name: 'country_id', type: 'varchar', length: 2 })
  id!: string;

  @Column({ name: 'country_name', type: 'varchar', length: 50 })
  countryName!: string;
}
