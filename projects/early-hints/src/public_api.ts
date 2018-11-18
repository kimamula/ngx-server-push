import { Injectable, NgModuleFactoryLoader, StaticProvider } from '@angular/core';
import { NgModuleFactoryLoaderForPush } from '@ngx-server-push/common';

const CRLF = '\r\n';

@Injectable()
export class NgModuleFactoryLoaderForPushWithEarlyHints extends NgModuleFactoryLoaderForPush {
  protected pushResources(resources: { [resource: string]: string }): void {
    const keys = Object.keys(resources);
    if (keys.length === 0) {
      return;
    }
    this.wrapper.response.connection.write(
      `HTTP/1.1 103 Early Hints${CRLF}${keys.map(resource =>
        `</${resource}>; rel=preload; as=${resources[resource]}`
      ).join(CRLF)}${CRLF}`
    );
  }
}

export const ngModuleFactoryLoaderProvider = {
  provide: NgModuleFactoryLoader,
  useClass: NgModuleFactoryLoaderForPushWithEarlyHints
} as StaticProvider;
