import { Inject, Injectable } from '@angular/core';
import { RequestResponseWrapper, REQUEST_RESPONSE_WRAPPER } from '@ngx-server-push/common';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

@Injectable()
export class ExpressRequestResponseWrapper implements RequestResponseWrapper {
  readonly userAgent?: string;
  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject(RESPONSE) private response: Response
  ) {
    this.userAgent = this.request.headers['user-agent'] as string;
  }
  addResponseLinkHeader(values: string[]): void {
    const existing = this.response.getHeader('link') || [];
    this.response.set('link', Array.isArray(existing) ? [...existing, ...values] : [existing.toString(), ...values]);
  }
}

export const requestResponseWrapperProvider = {
  provide: REQUEST_RESPONSE_WRAPPER,
  useClass: ExpressRequestResponseWrapper
};
