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

/*************************************
* Application Error Handler
**************************************/
'use strict';

/************************************
* External npm Modules
************************************/
const Sentry = require("@sentry/node");
const { stringify } = require('flatted');

/************************************
 * Internal npm Modules
 ************************************/
const appConstants = require('../libs/app-constants');
const appUtils = require('../libs/app-utils');
const config = require('../config');

/************************************
* Module exports / Public functions
************************************/
exports.handleError = handleError;

/************************************
* Public function definitions
************************************/

/**
 * set up Sentry for error logging
 */
const SENTRY_DSN = config.app.sentryDSN;
/*
* Setup additional Sentry configuration here
* see here: https://docs.sentry.io/clients/javascript/config/
*/
if (SENTRY_DSN && config.app.appEnv != 'local')
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: config.app.appEnv.toUpperCase(),
    });

// Log runtime/uncaught exceptions
process.on('uncaughtException', function (err) {
    handleError(null, null, err.stack, { tag: appConstants.APP.ERROR_TYPES.UNCAUGHT });
});



/***************
 * Generic error Handler. It logs error to server and sentry and sends the error response to frontend. 
 * Always use this function for handling errors and avoid handling errors individually.
 * 
 * options  
 *  tags : Error Type.This can have values : DLS_CORE_ERROR
 *  hideErrorPopupOnFE : If true, send 200 http code and prevents error popups on frontend. This is typically done when frontend services plan to handle specific errors themselves (instead of leveraging generic error hanlder)
 */
function handleError(req, res, err, options) {
    // Record Error in Sentry
    if (SENTRY_DSN && config.app.appEnv != 'local') {
        if (Error.prototype.isPrototypeOf(err)) {
            Sentry.captureException(err, { req: req, tags: { error_type: options.tag } });
        } else {
            Sentry.captureException(new Error(JSON.stringify(err)), { req: req, tags: { error_type: options.tag } });
        }
    }
    if (Object.keys(err).length == 0) {
        err = err.toString();
    }
    if(err && err.type == 'API_ERROR' && err.httpcode) {
        err.httpcode = transformAPIErrorCode(err.httpcode);
    }
    //Log the error to server
    let errorMessage = appUtils.getUserInfoFromReq(req) + "Error Type= " + options.tag + ", Error= " + stringify(err);
    if (options.errorInfo) {
        errorMessage += ", Additional Error Information= " + JSON.stringify(options.errorInfo);
    }
    syslog.error({ req }, errorMessage);
    if (res) {
        if (options.isFurtherComputationsNeeded) { // If any further computations needed do not send the response
            return;
        } else if (options.hideErrorPopupOnFE) {
            res.send({
                success: err.success,
                statusCode: err.statusCode,
                errorCode: err.errorCode
            });
        } else {
            const statusCode = getStatusCodeFromError(err, options);
            if (err.customError) {
                res.status(statusCode).send({
                    statusCode: err.statusCode,
                    errorCode: err.errorCode
                });
            } else {
                res.status(statusCode).send(appConstants.APP.ERROR_TYPES.INTERNAL_SERVER_ERROR);
            }
        }
    }
};

function transformAPIErrorCode(errorCode) {
    switch(errorCode) {
        case 403 : return 563;
        case 404 : return 564;
        case 504 : return 565;
        default: return errorCode;
    }
}

function getStatusCodeFromError(error, options) {
    // in case of unauthorized req and role mismatch 401 is in statusCode 
    // api errors codes are in httpcode which are already transformed via transformAPIErrorCode
    if(error && (error.type == 'API_ERROR' || 
        (error.statusCode == 401 && options && 
        ((options.tag == appConstants.APP.ERROR_TYPES.AUTHORIZATION_ERROR) || 
        (options.tag == appConstants.APP.ERROR_TYPES.ROLE_MISMATCH))))) {
        const errorCode = error.statusCode || error.httpcode;
        switch(errorCode) {
            case 563: // i.e 403
            case 564: // i.e 404
            case 565: // i.e 504
            case 401: return errorCode;
            default: return 500;
        }
    } else {
        return 500;
    }
}