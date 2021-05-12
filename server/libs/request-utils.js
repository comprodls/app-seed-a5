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
 
/**********************************************************************
 * Provides request utility functions to be used across App
 ***********************************************************************/
'use strict'; 

/************************************
* Internal npm Modules
************************************/
const redisConnectionHandler = require('./../libs/redis-connection');
const errorHandler = require('./../error/error-handler');
const appConstants = require('./app-constants');
/************************************
 * Module exports / Public functions
 ************************************/
exports.isHttps = isHttps;
exports.isReqAuthenticated = isReqAuthenticated;

/*********************************
 * Public Function Definitions
 *********************************/
// Function to check if request protocol is https
function isHttps (req) {   
    /*******
     *  We can't use req.protocol for detecting https requests on heroku as heroku load balancer changes the protocol before forwarding request to actual node server .
     *  Instead we need to check "x-forwarded-proto" header for detecting https requests on heroku
     *******/ 
    if (req.headers['x-forwarded-proto']) {
        if ( req.headers['x-forwarded-proto'] == 'https') {
            return true;
        }
    } else {
        if (req.protocol == 'https') {
            return true;
        } 
    }
    return false;    
}


/**
 * Middleware to Check for req authentication
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
 async function isReqAuthenticated (req, res, next) {
    if (!req.isAuthenticated()) {
        if(!redisConnectionHandler.redisConnected()){
            const errorMessage = "AUTHORIZATION-ERROR: Redis Unavailable, Request Path=" + req.path;
            errorHandler.handleError(req, res, {errorCode: errorMessage, statusCode: 500, customError: true }, { tag : appConstants.APP.ERROR_TYPES.REDIS });          
        } else {
            const errorMessage = "AUTHORIZATION-ERROR: Unauthorized request, Request Path=" + req.path;
          errorHandler.handleError(req, res, {errorCode: appConstants.APP.ERROR_TYPES.AUTHORIZATION_ERROR, statusCode: 401, customError: true, description: errorMessage }, { tag : appConstants.APP.ERROR_TYPES.AUTHORIZATION_ERROR });
        }
    } else {
        next()
    }
}
  