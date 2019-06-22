
export class APIModel {
  constructor(
    public id: number,
    public name: string,
    public services: Service[]
  ) {}
}

export class Service {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public url: string,
    public method: string,
    public headers: any,
    public sampleRequest: string,
    public sampleResponse: string
  ) {}
}
