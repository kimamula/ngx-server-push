import { Injectable, NgModuleFactoryLoader, StaticProvider } from '@angular/core';
import { NgModuleFactoryLoaderForPush } from '@ngx-server-push/common';

@Injectable()
export class NgModuleFactoryLoaderForPushWithPreloadLinkHeaders extends NgModuleFactoryLoaderForPush {
  protected pushResources(resources: { [resource: string]: string }): void {
    const headers = Object.keys(resources)
      .map(resource => `</${resource}>; rel=preload; as=${resources[resource]}`);
    const existing = this.wrapper.response.getHeader('link') || [];
    this.wrapper.response.setHeader(
      'link',
      Array.isArray(existing) ? [...existing, ...headers] : [existing.toString(), ...headers]
    );
  }
}

export const ngModuleFactoryLoaderProvider = {
  provide: NgModuleFactoryLoader,
  useClass: NgModuleFactoryLoaderForPushWithPreloadLinkHeaders
} as StaticProvider;
