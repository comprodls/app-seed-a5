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
 * Provides session utility functions to be used across App
 ***********************************************************************/ 
 'use strict';

 /************************************
  * Internal npm Modules
  ************************************/
 const config = require('./../config');

 /************************************
  * Module exports / Public functions
  ************************************/
 exports.initializeComproDLS = initializeComproDLS;
 
 /************************************
 * External npm Modules
 ************************************/
 const ComproDLS = require('comprodls-sdk');
 
 /*********************************
  * Public Function Definitions
  *********************************/

 //Function to initialize comprodls object
 //Pass optional orgid and token param, if token needs to be set comprodls object
function initializeComproDLS(req, orgid, token) {
     try{
         let options = {
             ...(req.headers['x-amzn-trace-id'] && {traceid: req.headers['x-amzn-trace-id']}),
             ...(orgid && {orgid}),
             ...(token && {token})
         }
         return ComproDLS.init(config.app.dlsEnv, config.app.dlsRealm, options);
     } catch(error) {
         return Promise.reject(error);
     }
 }
 