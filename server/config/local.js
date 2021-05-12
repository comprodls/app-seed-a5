/*************************************************************************
 *
 * COMPRO CONFIDENTIAL
 * __________________
 *
 *  [2015] - [2020] Compro Technologies Private Limited
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Compro Technologies Private Limited. The
 * intellectual and technical concepts contained herein are
 * proprietary to Compro Technologies Private Limited and may
 * be covered by U.S. and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.
 *
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Compro Technologies Pvt. Ltd..
 ***************************************************************************/

/********************************************************************
 * Configuration for "local" environment 
 ********************************************************************/
'use strict';

// Import base configuration and override it
const config = require('./base');

config.app.redirectToHttps = false;
config.app.enableBrowserCache = false;
config.app.sentry.uploadStaticAssets = false;
config.app.appEnv = 'local';
config.app.dlsAccountId = 'cup1';
config.app.dlsEnv = 'thor';
config.app.dlsRealm = 'asgard';
config.app.sentry.dsn = 'https://951f63c0e5774a4a8097c4941758509d@o559419.ingest.sentry.io/5694154';
config.app.expressPort = 3000;
config.app.session.redis.host = 'redis-12909.c246.us-east-1-4.ec2.cloud.redislabs.com';
config.app.session.redis.port = '12909';
config.app.session.redis.password = 'elJGORnDmhL9GVr4UySJQ9xY2JfKFJ3h';

module.exports = config;