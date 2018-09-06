#! /usr/bin/env node

import * as commander from 'commander';
import { join, dirname, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { createConfig, DEFAULT_CONFIG_FILENAME } from '@ngx-server-push/common';


const program = commander
  .version(require('./package.json').version)
  .usage(
`<bundleStatsFile> [options]
  Arguments:
  
    bundleStatsFile  Path to Webpack Stats JSON file.`
  )
  .option(
    '-o, --out <file>',
    `Path to which the resulting config file should be put. Defaults to <The same dir as bundleStatsFile>/${DEFAULT_CONFIG_FILENAME}`
  )
  .parse(process.argv);

let { args: [bundleStatsFile], out } = program;

if (!bundleStatsFile) {
  console.log('\n  Provide path to Webpack Stats file as first argument');
  program.outputHelp();
  process.exit(1);
}
bundleStatsFile = resolve(bundleStatsFile);
const config = createConfig(JSON.parse(readFileSync(bundleStatsFile, 'utf8')).chunks);
out = out ? resolve(out) : join(dirname(bundleStatsFile), DEFAULT_CONFIG_FILENAME);

writeFileSync(out, JSON.stringify(config, null, 2));
