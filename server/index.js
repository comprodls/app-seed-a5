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
 * This module configures express app.
 * Defines backend endpoints
 ************************************************************/
'use strict';

require('./libs/logging');
// Get App Constants
const appGlobals = require('./libs/app-globals');
const config = require('./config');
const { initializeExpressApp, serveStaticAssets } = require('./main');
// Get Application config

/************************************
 * Private Variables
************************************/
//Get Build modes
const buildMode = process.env.BUILD_ENV === 'development' ? "development" : "production";

//Express App Initialization
const app = initializeExpressApp();

//Express route handler
require('./routes/routes-handler')(app);

//Serve Static assets 
let port = config.app.expressPort;
if (buildMode == "production") {
	port = 8080;
	serveStaticAssets(app)
}

// Start Express server
const appserver = app.listen(port, function () {
	appGlobals.appInitialized = true;
	syslog.info('Server started on port ' + port + ". Build Mode: " + buildMode + ", Environment: " + config.app.appEnv);
});

appserver.keepAliveTimeout = 65000;
appserver.headersTimeout = 66000;


const startGracefulShutdown = (eventName) => {
	appGlobals.appInitialized = false;
	syslog.info(`${eventName} event, Starting shutdown of express`);
	setTimeout(() => {
		appserver.close(function (err) {
			if (err) {
				syslog.info(`${eventName} event, Error in express shutdown`, err);
			} else {
				syslog.info(`${eventName} event, Completed express shutdown`);
			}
		})
	}, 15000);
}
if (config.app.appEnv != "local") {
	process.on('SIGTERM', startGracefulShutdown);
	process.on('SIGINT', startGracefulShutdown);
}