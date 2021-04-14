const S3UploadAssetsPlugin = require('./webpack-plugins/s3-upload-assets-plugin');
const config = require('./server/config');
const versioningTimestamp = new Date().getTime();
const webpack = require('webpack');

let uploadOptions = {
    bucket : config.app.staticAssets.bucket,
    region: config.app.staticAssets.region,
    accessKeyId: config.app.staticAssets.accessKeyId,
    secretAccessKey: config.app.staticAssets.secretAccessKey,
    directory : 'dist', //Directory to upload on s3
    versioningTimestamp : versioningTimestamp
}

module.exports = {
  plugins: [
    config.app.appEnv != "local" && new S3UploadAssetsPlugin(uploadOptions),
    new webpack.DefinePlugin({
        'SENTRY_DSN': JSON.stringify(config.app.sentryDSN),
    })
  ].filter(Boolean)
};