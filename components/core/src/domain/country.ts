export class Country {
  readonly id: string;
  readonly countryName: string;

  constructor(id: string, countryName: string) {
    this.id = id;
    this.countryName = countryName;
  }

  toJSON() {
    return {
      id: this.id,
      countryName: this.countryName,
    };
  }
}
