const S3UploadAssetsPlugin = require('./webpack-plugins/s3-upload-assets-plugin');
const config = require('./server/config');
const versioningTimestamp = new Date().getTime();
const webpack = require('webpack');
const path = require('path');
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

let uploadOptions = {
  bucket: config.app.staticAssets.bucket,
  region: config.app.staticAssets.region,
  accessKeyId: config.app.staticAssets.accessKeyId,
  secretAccessKey: config.app.staticAssets.secretAccessKey,
  directory: 'dist', //Directory to upload on s3
  versioningTimestamp: versioningTimestamp,
  appFolder: config.app.staticAssets.assetsAppFolder
}

module.exports = {
  plugins: [
    config.app.appEnv != "local" && new S3UploadAssetsPlugin(uploadOptions),
    new webpack.DefinePlugin({
      'SENTRY_DSN': JSON.stringify(config.app.sentry.dsn),
    }),
    /**
       * Plugin: sentry-webpack-plugin
       * Description: Upload Source Maps To Sentry for better error logging.
       *
       * See: https://github.com/getsentry/sentry-webpack-plugin
       *
       */
    config.app.sentry.uploadStaticAssets ? new SentryWebpackPlugin({
      release: config.app.appEnv + '-' + config.app.staticAssets.assetsAppFolder + '-' + versioningTimestamp,
      include: path.resolve(__dirname, 'dist'),
      configFile: path.resolve(__dirname, '.sentryclirc'),
      urlPrefix: '/' + config.app.staticAssets.assetsBasePath + '/' + versioningTimestamp + '/'
    }) : false,
  ].filter(Boolean)
};