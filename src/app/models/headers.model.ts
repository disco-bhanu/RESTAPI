export class HeadersModel {
  constructor(
    public key: string,
    public value: string,
    public desc?: string,
    public selected?: boolean
  ) {}
}
