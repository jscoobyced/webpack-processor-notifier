# webpack-processor-notifier

A plugin to notify of the success or failure of a webpack build. It allows to be passed as processor.
When using the ```optimize-css-assets-webpack-plugin``` I couldn't get the ```webpack-build-notifier``` to work on CSS errors. It seems this plugin doesn't call the proper error callback (or one of it's dependencies).
The notification uses [node-notifier](https://www.npmjs.com/package/node-notifier "NPM Node Notifier"), you can refer to it for the configuration of icons and sounds.

## Using it directly

You can use this plugin as a build success/failure notifier. Configure it in your ```webpack.config.js``` (below is for a MS Windows machine):

```js
const WebpackProcessorNotifier = require('webpack-processor-notifier');
module.exports = {
    // ...
    plugins: [
        new WebpackProcessorNotifier({
                buildType: 'Some build type',
                iconPath: 'D:/media/',
                infoIcon: 'hero.png',
                errorIcon: 'yolo.png',
                infoSound: 'Notification.Looping.Call',
                errorSound: 'Notification.Looping.Alarm4'
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

```infoSound``` : The sound to use for successfull build.

```errorSound``` : The sound to use for failed build.
