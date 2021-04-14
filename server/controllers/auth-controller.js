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
* Provides functions for user authentication. 
***********************************************************************/
'use strict';

const { findUserDetailsFromEmail } = require("../mock-data/users");

/************************************
* Module exports / Public functions
************************************/
exports.login = login;
exports.logout = logout;
exports.isUserAuthenticated = isUserAuthenticated;
/************************************
* Public function definitions
************************************/
// Handle user login request
async function login(req, res) {
  let userDetails = findUserDetailsFromEmail(req.body.email);
  if(userDetails && req.body.password == userDetails.password) {
    await passportLogin(req, res,  userDetails)
    res.send({valid: true})
  } else res.send({valid:false})
}

// Handle user logout request
function logout(req, res) {
  //Passport logout and destroy session
  req.logout();
  req.session.destroy(() => {
    //Return success response
    return res.status(200).send({ success: true })
  });
}

// Function to check if passport session for user exist or not 
function isUserAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.send({
      userAuthenticated: true
    });
  } else {
    res.send({
      userAuthenticated: false
    });
  }
}


/************************************
* Private functions
************************************/
// Passport Login
function passportLogin(req, res, user) {
  return new Promise((resolve, reject) => {
    //Passport Login
    req.logIn({ "userId": user.userId }, (err) => {
      //If error logging in passport, send error response
      if (err) {
        reject(err);
      }
      req.session.userId = user.userId;
      req.session.email = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      resolve();
    });
  });
}