export class APIDetails {

  constructor(
    public name: string,
    public id: string,
    public service: Service
  ) { }
}

export class Headers {
  constructor( public key: string, public value: string) {}
}

export class Service {
  constructor(
    public name: string,
    public id: number,
    public description: string,
    public url: string,
    public method: String,
    public body: string,
    public headers: Headers[],
    public sampleRequest: string,
    public sampleResponse: string
  ) { }
}
