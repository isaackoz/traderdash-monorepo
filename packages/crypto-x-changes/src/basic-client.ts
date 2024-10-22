import { BasicRestClient } from "./rest/basic-rest-client";
import { BasicWsClient } from "./ws/basic-ws-client";

export abstract class BasicClient {
  public rest: BasicRestClient;
  //public ws: BasicWsClient;
  constructor(rest: BasicRestClient) {
    this.rest = rest;
    //this.ws = ws;
  }

  // Shared functionality
  protected log(message: string) {
    console.log(`${this.constructor.name}: ${message}`);
  }
}
