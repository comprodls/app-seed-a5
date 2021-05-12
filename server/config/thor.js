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
 * Configuration for "thor" environment 
 ********************************************************************/
'use strict';

// Import base configuration and override
const config = require('./base');

config.app.session.ttl = 3600; //1hour
config.app.sentry.dsn = 'https://951f63c0e5774a4a8097c4941758509d@o559419.ingest.sentry.io/5694154';

module.exports = config;