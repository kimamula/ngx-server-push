import { Config } from './Config';

const SOURCEMAP_REGEXP = /\.map$/;
const REQUEST_SUFFIX_REGEXP = /\.ngfactory$/;
export const DEFAULT_CONFIG_FILENAME = 'ngx-server-push.config.json';

export interface Chunk {
  files: string[];
  origins: Origin[];
}

export interface Origin {
  request?: string;
}

export function createConfig(chunks: Chunk[]): Config {
  const config: Config = {};
  for (const chunk of chunks) {
    const files = chunk.files.filter(file => !SOURCEMAP_REGEXP.test(file));
    for (const origin of chunk.origins) {
      const loadPath = origin.request ? origin.request.replace(REQUEST_SUFFIX_REGEXP, '') : '';
      if (!config[loadPath]) {
        config[loadPath] = {};
      }
      files.forEach((file) => {
        if (config[loadPath][file]) {
          return;
        }
        let type;
        if (file.endsWith('.js')) {
          type = 'script';
        } else if (file.endsWith('.css')) {
          type = 'style';
        }
        if (type) {
          config[loadPath][file] = type;
        }
      });
    }
  }
  return config;
}
