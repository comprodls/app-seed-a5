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
 * Provides utility functions to be used across App
 ***********************************************************************/
'use strict';

/************************************
* Internal npm Modules
************************************/
const config = require('./../config');

/************************************
* Module exports / Public functions
************************************/
exports.getUserInfoFromReq = getUserInfoFromReq;

/************************************
* Public function definitions
************************************/

// Get User Info From Request
function getUserInfoFromReq(req) {
    let userInfo = "";
    if (req) {
        if (config.app.appEnv != 'local') {
            let ipaddress;
            if(req.headers && req.headers['x-forwarded-for']) {
                ipaddress = req.headers['x-forwarded-for'];
            } else if(req.connection && req.connection.remoteAddress) {
                ipaddress = req.connection.remoteAddress;
            }
            if(ipaddress)
                userInfo = "Client IP address= " + ipaddress + ", ";
        }
        if (req.session) {
            userInfo += "UserId= " + req.session.userId + ", ";
        }
    }
    return userInfo;
}
