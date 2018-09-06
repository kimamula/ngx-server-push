# Disclaimer

This library is an alpha version. **It is NOT recommended to use this library in a production environment.** 

# ngx-server-push

Enables HTTP/2 Server Push in Angular Universal apps.

This library is designed to be used behind an HTTP/2 reverse proxy as written [here](https://github.com/Polymer/prpl-server#link-preload-headers).

## Usage

### 0. Prepare your Angular Universal app

Follow [the official doc](https://angular.io/guide/universal).

### 1. Generate a config file

#### Option 1. With a cli tool

```sh
$ npm install --save-dev @ngx-server-push/cli

# Build your client side angular app with --stats-json option
$ ng build --prod --stats-json

# Execute ngxServerPush command with specifying the generated stats file
$ npx ngxServerPush dist/browser/stats.json
```

You can change the path of the output file with `-o` (or `--out`) option, which defaults to `<The same dir as stats.json>/ngx-server-push.config.json`.

```sh
$ npx ngxServerPush dist/browser/stats.json -o dist/foo-bar.config.json
```

#### Option 2. With a webpack plugin

```sh
$ npm install --save-dev @ngx-server-push/webpack
```

```js
// webpack.config.js
const { NgxServerPushWebpackPlugin } = require('@ngx-server-push/webpack');

module.exports = {
  // ...
  plugins: [
    new NgxServerPushWebpackPlugin()
  ],
  // ...
};
```

You can change the name of the output file with `out` option, which defaults to `ngx-server-push.config.json`.

```ts
new NgxServerPushWebpackPlugin({ out: 'foo-bar.config.json' })
```

### 2. Add providers for your server-side engine

```sh
$ npm install @ngx-server-push/express
```

```diff
// src/app/app.server.module.ts
+ import { requestResponseWrapperProvider } from '@ngx-server-push/express';
+ import { ngModuleFactoryLoaderProvider } from '@ngx-server-push/common';
// ...

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule
  ],
  providers: [
    // Add universal-only providers here
+     requestResponseWrapperProvider,
+     ngModuleFactoryLoaderProvider
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
```

```diff
// server.ts
+ import { providePushConfig } from '@ngx-server-push/common';
// ...

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
-     provideModuleMap(LAZY_MODULE_MAP)
+     provideModuleMap(LAZY_MODULE_MAP),
+     // The require path should be relative to the build output path of the server.ts
+     providePushConfig(require('./browser/ngx-server-push.config.json'))
  ]
}));

// ...

// All regular routes use the Universal engine
app.get('*', (req, res) => {
-   res.render('index', { req });
+   res.render('index', { req, res });
});

// ...
```

**TODO: Support other engines than Express.**

## Demo

https://ngx-server-push-demo.appspot.com/

![Chrome devtool network tab top](/docs/images/network-top.png)

https://ngx-server-push-demo.appspot.com/lazy

![Chrome devtool network tab lazy](/docs/images/network-lazy.png)

You can see that the lazily loaded chunk (0.8c6a7127511b5f2ffe40.js) is pushed as well in the second screenshot.

Source code: https://github.com/kimamula/universal-starter/tree/ngx-server-push

## Limitation

Chrome users may have to disable `Experimental QUIC protocol` in `about:flags` to make HTTP/2 Server Push work on Google App Engine (as in the demo).

Related issues:
- https://github.com/GoogleChromeLabs/http2push-gae/issues/20
- https://issuetracker.google.com/u/1/issues/35898954
