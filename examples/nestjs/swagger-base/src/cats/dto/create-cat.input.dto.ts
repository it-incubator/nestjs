export class CreateCatInputDTO {
  name: string;
  dob: Date;
  price: number;
  /**
   * A list of cats types
   * @example ['toy']
   */
  type: CatType;
}

export enum CatType {
  Persian = 'persian',
  MaineCoon = 'maine',
  Ragdoll = 'ragd',
  Siamese = 'siamese',
  Toy = 'toy',
}
