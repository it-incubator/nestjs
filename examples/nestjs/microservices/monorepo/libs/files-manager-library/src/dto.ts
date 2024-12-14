export class FileOutputDTO {
  constructor(
    public id: number,
    public size: number,
    public name: string,
    public extension: string,
  ) {}
}
