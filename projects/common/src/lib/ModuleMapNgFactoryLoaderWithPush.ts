import {
  Compiler,
  Inject,
  Injectable,
  InjectionToken,
  NgModuleFactory,
  NgModuleFactoryLoader,
  StaticProvider
} from '@angular/core';
import { MODULE_MAP, ModuleMapNgFactoryLoader } from '@nguniversal/module-map-ngfactory-loader';
import { ModuleMap } from '@nguniversal/module-map-ngfactory-loader/src/module-map';
import { browserCapabilities } from 'browser-capabilities';
import { Config } from './Config';
import { RequestResponseWrapper } from './RequestResponseWrapper';

export const REQUEST_RESPONSE_WRAPPER = new InjectionToken<RequestResponseWrapper>('REQUEST_RESPONSE_WRAPPER');
export const PUSH_CONFIG = new InjectionToken<Config>('PUSH_CONFIG');

@Injectable()
export class ModuleMapNgFactoryLoaderWithPush extends ModuleMapNgFactoryLoader {
  private readonly loadedPath: string[] = [];
  private readonly hasPushCapability: boolean;

  constructor(
    compiler: Compiler,
    @Inject(MODULE_MAP) moduleMap: ModuleMap,
    @Inject(REQUEST_RESPONSE_WRAPPER) private wrapper: RequestResponseWrapper,
    @Inject(PUSH_CONFIG) private readonly pushConfig: Config
  ) {
    super(compiler, moduleMap);
    this.hasPushCapability = !!wrapper.userAgent && browserCapabilities(wrapper.userAgent).has('push');
    this.onLoad('');
  }

  load(loadChildrenString: string): Promise<NgModuleFactory<any>> {
    return super.load(loadChildrenString)
      .then(result => {
        const hashIndex = loadChildrenString.indexOf('#');
        this.onLoad(hashIndex < 0
          ? loadChildrenString
          : loadChildrenString.substr(0, hashIndex));
        return result;
      });
  }

  onLoad(loadPath: string): void {
    if (this.loadedPath.indexOf(loadPath) >= 0) {
      return;
    }
    this.loadedPath.push(loadPath);
    const resources = this.pushConfig[loadPath] || {};
    this.wrapper.addResponseLinkHeader(Object.keys(resources)
      .map(resource => `</${resource}>; rel=preload; as=${resources[resource]}${this.hasPushCapability ? '' : '; nopush'}`)
    );
  }
}

export const ngModuleFactoryLoaderProvider = {
  provide: NgModuleFactoryLoader,
  useClass: ModuleMapNgFactoryLoaderWithPush
};

export function providePushConfig(pushConfig: Config): StaticProvider {
  return { provide: PUSH_CONFIG, useValue: pushConfig };
}
