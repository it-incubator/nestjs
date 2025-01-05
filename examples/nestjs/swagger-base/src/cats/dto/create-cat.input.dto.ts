import { IsOptional, Max, Min } from 'class-validator';

export class CreateCatInputDTO {
  name: string;
  dob: Date;
  @Min(10)
  @Max(100)
  @IsOptional()
  price?: number;
  /**
   * cat type
   * @example 'toy'
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
