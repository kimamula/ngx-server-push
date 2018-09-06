import { Compiler } from 'webpack';
import { createConfig, DEFAULT_CONFIG_FILENAME } from '@ngx-server-push/common';
import { Tapable } from 'tapable';

export interface NgxServerPushWebpackPluginOptions {
  out?: string;
}

export class NgxServerPushWebpackPlugin implements Tapable.Plugin {
  constructor(private option: NgxServerPushWebpackPluginOptions = {}) { }

  apply(compiler: Compiler): void {
    compiler.hooks.emit.tap('NgxServerPushWebpackPlugin', compilation => {
      const output = JSON.stringify(createConfig(compilation.chunkGroups), null, 2);
      compilation.assets[this.option.out || DEFAULT_CONFIG_FILENAME] = {
        source() {
          return output;
        },
        size() {
          return output.length;
        },
      };
    });
  }
}
