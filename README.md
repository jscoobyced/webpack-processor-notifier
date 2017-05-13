# webpack-processor-notifier

A plugin to notify of the success or failure of a webpack build. It allows to be passed as processor.
When using the ```optimize-css-assets-webpack-plugin``` I couldn't get the ```webpack-build-notifier``` to work on CSS errors. It seems this plugin doesn't call the proper error callback (or one of it's dependencies).

## Using it directly

You can use this plugin as a build success/failure notifier. Configure it in your ```webpack.config.js```:

```js
const WebpackProcessorNotifier = require('webpack-processor-notifier');
module.exports = {
    // ...
    plugins: [
        new WebpackProcessorNotifier({
                buildType: "Some build type"
            })
    ]
    // ...
}
```

## Using it under a processor

Currently tested only with css-nano

```js
const WebpackProcessorNotifier = require('webpack-processor-notifier');
const cssnano = require('css-nano');

module.exports = {
    // ...
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: new WebpackProcessorNotifier({
                buildType: "CSS",
                processor: cssnano
            }),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                safe: false
            }
        })
    ]
    // ...
}
```

## Configuration options

```buildType``` : This is used to customize the title of the notification.

```processor``` : The kind of processor to use. Currently only supports ```css-nano```.

```infoIcon``` : The icon to use for successfull build.

```errorIcon``` : The icon to use for failed build.

```iconPath``` : The path of the icons.
