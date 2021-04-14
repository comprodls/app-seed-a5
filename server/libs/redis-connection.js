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

/***********************************************************
 * Module to handle Redis connections. 
 * Redis is currently being used to store user session data.
 ************************************************************/
'use strict';


/************************************
 * External npm Modules
************************************/
const redis = require('redis');

/************************************
* Internal npm Modules
************************************/
// Application config
const config = require('../config');
// Application constants
const appConstants = require('../libs/app-constants');
// Generic Error Handler
const errorHandler = require('../error/error-handler');


/************************************
* Private Variables
************************************/
let isRedisConnected = false;
let redisClient;

const redisHost = config.app.session.redis.host;
const redisPort = config.app.session.redis.port;
const redisPassword = config.app.session.redis.password;

/************************************
* Public functions Definitions
************************************/
function getRedisClient() {
	if (redisClient) {
		return redisClient;
	} else {

		//Create Redis client
		redisClient = redis.createClient(redisPort, redisHost);
		// Redis auth is not required in case of AWS ElastiCache Redis
		if (redisPassword && redisPassword.trim() && redisPassword !== 'undefined') {
			//Authorize Redis client
			redisClient.auth(redisPassword);
		}

		// Redis Event handlers
		redisClient.on('connect', () => {
			isRedisConnected = true;
			syslog.info('REDIS connection successful.');
		});
		redisClient.on('error', (err) => {
			isRedisConnected = false;
			errorHandler.handleError(null, null, "REDIS-ERROR: Connection Error, " + err, { tag: appConstants.APP.ERROR_TYPES.REDIS });
		});
		redisClient.on('end', () => {
			isRedisConnected = false;
			syslog.info('REDIS connection closed');
		});
		return redisClient;
	}

}

function redisConnected() {
	return isRedisConnected;
}

/************************************
* Module exports / Public functions
************************************/
exports.getRedisClient = getRedisClient;
//Stores the current status of redis connection
exports.redisConnected = redisConnected;