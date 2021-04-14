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
 * This module defines backend endpoints
 ************************************************************/
'use strict';

/************************************
 * Internal npm Modules
 ************************************/
// Controller for common functions 
const baseController = require('./../controllers/base-controller');
const authController = require('./../controllers/auth-controller');
const productController = require('./../controllers/product-controller');
const reqUtils = require('./../libs/request-utils');

module.exports = function (app) {

    /****************************
     * Unauthenticated Routes
     ****************************/
    app.post('/apigateway/login',  authController.login);
    /****************************
     * Authenticated Routes
     ****************************/
    app.get('/apigateway/user',reqUtils.isReqAuthenticated, baseController.getUserInfo);
    app.get('/apigateway/bundles', reqUtils.isReqAuthenticated, productController.getAllBundles);
    app.post('/apigateway/logout', reqUtils.isReqAuthenticated, authController.logout);
}