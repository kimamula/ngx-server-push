import { Inject, Injectable, StaticProvider } from '@angular/core';
import { RequestResponseWrapper, REQUEST_RESPONSE_WRAPPER } from '@ngx-server-push/common';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

@Injectable()
export class ExpressRequestResponseWrapper implements RequestResponseWrapper {
  constructor(
    @Inject(REQUEST) public request: Request,
    @Inject(RESPONSE) public response: Response
  ) {}
}

export const requestResponseWrapperProvider = {
  provide: REQUEST_RESPONSE_WRAPPER,
  useClass: ExpressRequestResponseWrapper
} as StaticProvider;
