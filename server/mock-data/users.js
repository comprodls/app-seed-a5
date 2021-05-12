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
 * Sample Users data
 ********************************************************************/


'use strict';
const users = [
    {
        "email": "user1@yopmail.com",
        "password": "Engage11",
        "firstName": "John",
        "lastName": "Doe",
        "userId": "ec21d9d5-440b-4476-8766-4c6fc11ac60b"
    },
    {
        "email": "user2@yopmail.com",
        "password": "Engage11",
        "firstName": "Jane",
        "lastName": "Doe",
        "userId": "ec21d9d5-550b-4476-8766-4c6fc11ac60c"
    }
]


function findUserDetailsFromEmail(email) {
    if(email == undefined) return users[0]
    return users.find((user)=> user.email == email)
}

exports = module.exports = users;
exports.findUserDetailsFromEmail = findUserDetailsFromEmail