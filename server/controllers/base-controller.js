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

'use strict';

/************************************
* Module exports / Public functions
************************************/
exports.getUserInfo = getUserInfo;

/************************************
* Public function definitions
************************************/
async function getUserInfo(req, res) {
    const user = {
        firstName : req.session.firstName,
        lastName : req.session.lastName,
        userId : req.session.userId,
        email : req.session.email
    }
    res.send({ user: user});
}


