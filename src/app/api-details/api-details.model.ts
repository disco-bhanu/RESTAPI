export class APIDetails {

  constructor(
    public name: String,
    public url: String,
    public method: String,
    public headers: Headers,
    public sampleRequest: String,
    public sampleResponse: String
  ) { }
}

export class Headers {
  constructor( public contentType: String, public dataType: String) {}
}
