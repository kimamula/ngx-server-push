import { IncomingMessage, ServerResponse } from 'http';

export interface RequestResponseWrapper {
  request: IncomingMessage;
  response: ServerResponse;
}
