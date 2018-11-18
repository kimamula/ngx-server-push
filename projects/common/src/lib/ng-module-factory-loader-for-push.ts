import {
  Compiler,
  Inject,
  InjectionToken,
  NgModuleFactory,
  StaticProvider
} from '@angular/core';
import { MODULE_MAP, ModuleMapNgFactoryLoader } from '@nguniversal/module-map-ngfactory-loader';
import { ModuleMap } from '@nguniversal/module-map-ngfactory-loader/src/module-map';
import { Config } from './config';
import { RequestResponseWrapper } from './request-response-wrapper';

export const REQUEST_RESPONSE_WRAPPER = new InjectionToken<RequestResponseWrapper>('REQUEST_RESPONSE_WRAPPER');
export const PUSH_CONFIG = new InjectionToken<Config>('PUSH_CONFIG');

export abstract class NgModuleFactoryLoaderForPush extends ModuleMapNgFactoryLoader {
  private readonly loadedPath: string[] = [];

  protected constructor(
    compiler: Compiler,
    @Inject(MODULE_MAP) moduleMap: ModuleMap,
    @Inject(REQUEST_RESPONSE_WRAPPER) protected readonly wrapper: RequestResponseWrapper,
    @Inject(PUSH_CONFIG) protected readonly pushConfig: Config
  ) {
    super(compiler, moduleMap);
    this.onLoad('');
  }

  load(loadChildrenString: string): Promise<NgModuleFactory<any>> {
    return super.load(loadChildrenString)
      .then(result => {
        const hashIndex = loadChildrenString.indexOf('#');
        this.onLoad(hashIndex < 0
          ? loadChildrenString
          : loadChildrenString.substr(0, hashIndex)
        );
        return result;
      });
  }

  private onLoad(loadPath: string): void {
    if (this.loadedPath.indexOf(loadPath) >= 0) {
      return;
    }
    this.loadedPath.push(loadPath);
    // todo Cookie 操作はこっちでやる、しかしそもそも Cookie とキャッシュは連動しないはずなので、大丈夫なのだろうか
    this.pushResources(this.pushConfig[loadPath] || {});
  }

  protected abstract pushResources(resources: { [resource: string]: string }): void;
}

export function providePushConfig(pushConfig: Config): StaticProvider {
  return { provide: PUSH_CONFIG, useValue: pushConfig };
}
