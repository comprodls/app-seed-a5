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
 * Base configuration
 ********************************************************************/
'use strict';

const config = {
    "app": {
        //REDIRECT_TO_HTTPS environment variable (if set) will take precedence
        "redirectToHttps": process.env.REDIRECT_TO_HTTPS ? ((process.env.REDIRECT_TO_HTTPS == "ENABLE") ? true : false) : true,

        //Enable cache headers for browsers
        "enableBrowserCache": true,

        // Max age of static assets cache - 1 Year. Applicable if enableBrowserCache is true
        "browserCacheMaxAge": 31536000000,

        "staticAssets": {
            "region": process.env.AWS_REGION,
            "bucket": process.env.STATIC_ASSETS_AWS_BUCKET,
            "assetsBasePath": process.env.STATIC_ASSETS_BASEPATH,
            "accessKeyId": process.env.STATIC_ASSETS_ACCESS_KEY_ID,
            "secretAccessKey": process.env.STATIC_ASSETS_SECRET_ACCESS_KEY,
            "assetsAppFolder": process.env.STATIC_ASSETS_APP_FOLDER || 'engage'
        },
        "sentry": {
            "uploadStaticAssets": true, // Upload source maps to sentry via sentry webpack plugin
            "dsn": process.env.SENTRY_DSN,
        },
        "session": {
            // Secret for encrypting session cookie
            "cookieSecret": "compro123",
            "cookieDomain": process.env.COOKIE_DOMAIN,
            "cookiePrefix": 'c_',
            "ttl": 259200, //Passport session expiry time in seconds : 3 days
            // Redis URLs and Credentials
            // This is used to store user sessions on backend
            "redis": {
                // Redis URL
                "host": process.env.REDIS_HOST,
                "port": process.env.REDIS_PORT,
                "password": process.env.REDIS_PASSWORD
            }
        },
        "appEnv": process.env.APP_ENVIRONMENT,
        "dlsAccountId" : process.env.DLS_ACCOUNT_ID, 
        "dlsRealm" : process.env.DLS_REALM,
        "dlsEnv" : process.env.DLS_ENV,
        "orchestration": process.env.ORCHESTRATION,
        "expressPort": process.env.PORT || 5000,
        //List of Endpoints that are to be exempted from the CSRF Check
        "exemptCSRFendpointList": []
    }
}

module.exports = config;
