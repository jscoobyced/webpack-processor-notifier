const Notifier = require('node-notifier');
const path = require('path');
const os = require('os');

var WebpackProcessorNotifier = function (options) {
  this.options = options || {};

  if (this.options.buildType === undefined) {
    this.options.buildType = "Default";
  }
  if (this.options.processor === undefined) {
    this.options.processor = {
      process: function (content, data) {
        console.log("Default processor does nothing.");
        return {
          error: false,
          then: function (success, fail) {}
        }
      }
    };
  }
  if (this.options.infoIcon === undefined) {
    this.options.infoIcon = 'icon-info.png';
  }
  if (this.options.errorIcon === undefined) {
    this.options.errorIcon = 'icon-error.png';
  }
  if (this.options.iconPath === undefined) {
    this.options.iconPath = path.resolve(path.dirname(__filename), 'src');
  }
  if (this.options.infoSound === undefined) {
    if (os.platform == 'darwin') {
      this.options.infoSound = 'Bottle';
    } else if (os.platform == 'win32') {
      this.options.infoSound = 'Notification.Looping.Call2';
    } else {
      this.options.infoSound = true;
    }
  }
  if (this.options.errorSound === undefined) {
    if (os.platform == 'darwin') {
      this.options.errorSound = 'Glass';
    } else if (os.platform == 'win32') {
      this.options.errorSound = 'Notification.Looping.Alarm4';
    } else {
      this.options.errorSound = true;
    }
  }
};

WebpackProcessorNotifier.prototype.showNotification = function (success, error) {
  var title = this.options.buildType + ' build successful!';
  var message = this.options.buildType + ' build completed successfully.';
  var type = 'info';
  var icon = this.options.infoIcon;
  var sound = this.options.infoSound;
  if (!success) {
    title = this.options.buildType + ' build failed!';
    message = 'Error: ' + error.message;
    type = 'error';
    icon = this.options.errorIcon;
    sound = this.options.errorSound;
  }
  var options = {
    title: title,
    message: message,
    time: 2000,
    icon: path.resolve(this.options.iconPath, icon),
    type: type,
    sound: sound
  };
  Notifier.notify(options);
}

WebpackProcessorNotifier.prototype.onCompilationDone = function (results) {
  this.showNotification(!results.hasErrors(), results.compilation.errors[0]);
};

WebpackProcessorNotifier.prototype.process = function (content, data) {
  var result = this.options.processor.process(content, data);
  if (result.error) {
    var errorLen = Object.keys(result.error).length;
    var errorMessage = "There were " + errorLen + " error" + (errorLen > 1 ? "s" : "") + "."
    this.showNotification(false, {
      message: errorMessage
    });
    var error = result.error;
    result = {
      then: function (success, fail) {
        fail(error);
      }
    }
  } else {
    this.showNotification(true, "");
  }
  return result;
};

WebpackProcessorNotifier.prototype.apply = function (compiler) {
  compiler.plugin('done', this.onCompilationDone.bind(this));
};

exports.default = WebpackProcessorNotifier;
module.exports = exports['default'];