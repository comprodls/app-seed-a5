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
 * Application Logger
 **************************************/
'use strict';

/************************************
* External npm Modules
************************************/
const bunyan = require('bunyan');
const bformat = require('bunyan-format');

/************************************
* Internal npm Modules
************************************/
const appUtils = require('./../libs/app-utils');
const config = require('./../config');
/************************************
* Private Variables
************************************/
//Configure logging format
const formatOut = bformat({
    outputMode: 'short'
});
//Request serializer for bunyan logger
function reqSerializer(req) {
    const reqSerializerObj = {
        ...(req && {method: req.method}),
        ...(req && {url : req.url}),
    }

    if(config.app.orchestration === 'ECS' && req) {
        reqSerializerObj['x_amzn_trace_id'] = req.headers['x-amzn-trace-id'];
    }
    return reqSerializerObj;
}
// Option for logging
const loggerOptions = {
    name: 'web',
    stream: formatOut,
    level: 'info',
    serializers: {
        req: reqSerializer
    }
}

/************************************
* Module exports / Public functions
************************************/
exports.logInfo = logInfo;

/************************************
* Public functions definition
************************************/

//Remove stream option if app is run via AWS ECS
if(config.app.orchestration === 'ECS') {
    delete loggerOptions.stream;
}
//Create global syslog object.
global.syslog = bunyan.createLogger(loggerOptions);

/**
 * Generic info Handler to logs info on server
 * 
 * @param {*} req : express request object
 * @param {*} res : express response object - only needed for sending response to frontend
 * @param {*} info : info object for logging */

function logInfo(req, res, info) {
    let infoString = appUtils.getUserInfoFromReq(req);
    if(options.infoType) {
        infoString += "Info Type=" + options.infoType
    } 
    infoString += ", INFO=" + JSON.stringify(info);

    //Log the info to server
    syslog.info({req} , infoString);
}


  








