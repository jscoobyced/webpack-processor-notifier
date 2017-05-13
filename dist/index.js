const Notifier = require('node-notifier');
const path = require('path');

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
};

WebpackProcessorNotifier.prototype.showNotification = function (success, error) {
  var title = this.options.buildType + ' build successful!';
  var message = this.options.buildType + ' build completed successfully.';
  var type = 'info';
  var icon = this.options.infoIcon;
  if (!success) {
    title = this.options.buildType + ' build failed!';
    message = 'Error: ' + error.message;
    type = 'error';
    icon = this.options.errorIcon;
  }
  var options = {
    title: title,
    message: message,
    time: 2000,
    icon: path.resolve(this.options.iconPath, icon),
    type: type
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