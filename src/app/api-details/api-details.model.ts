export class APIDetails {

  constructor(
    public name: string,
    public id: string,
    public service: Service
  ) { }
}

export class Headers {
  constructor( public contentType: string, public dataType: string) {}
}

export class Service {
  constructor(
    public name: string,
    public id: number,
    public description: string,
    public url: string,
    public method: String,
    public body: string,
    public headers: any,
    public sampleRequest: string,
    public sampleResponse: string
  ) { }
}
