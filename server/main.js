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
 * This module configures express app.
 ************************************************************/

'use strict';

const config = require('./config');
/************************************
 * External npm Modules
 ************************************/
const express = require('express');
const frameguard = require('frameguard');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const compression = require('compression');
const passport = require('passport');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const nocache = require("nocache");

/************************************
* Module exports / Public functions
************************************/
exports.initializeExpressApp = initializeExpressApp;
exports.serveStaticAssets = serveStaticAssets;
const redisConnectionHandler = require('./libs/redis-connection');
const errorHandler = require('./error/error-handler');
const appGlobals = require('./libs/app-globals');
const reqUtils = require('./libs/request-utils');

/************************************
* Public function definitions
************************************/
function initializeExpressApp(options) {

    const redisClient = redisConnectionHandler.getRedisClient();
    // Initiate Express App
    const app = express();

    /****************************
     *  Security Headers
     ****************************/
    // To remove the X-Powered-By header.
    // Refer https://helmetjs.github.io/docs/hide-powered-by/
    app.use(helmet.hidePoweredBy())

    /**
     * Adding "X-XSS-Protection: 1; mode=block" header for protection against XSS attacks.
     * Above header enables XSS filtering and the browser will prevent rendering of the page if an attack is detected (by browser).
     * Refer https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
     */
    app.use(helmet.xssFilter())

    /**
     * Adding "X-Content-Type-Options: nosniff" header for protection against MIME type Sniffing attacks.
     * Refer https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options and https://www.keycdn.com/support/what-is-mime-sniffing
     */
    app.use(helmet.noSniff())

    /**
     *
     * Adding "Strict-Transport-Security: maxage=31536000; includeSubDomains;preload" header
     * This allows the site to be loaded only via HTTPS (not HTTP) 
     * Refer https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security#Preloading_Strict_Transport_Security and https://www.chromium.org/hsts
     * TODO - We are still not sure if we need to add 'preload' attribute. 'preload' attribute is generally added when a doamin is registered 
     * with Google HSTS List. Refer https://www.chromium.org/hsts and https://hstspreload.org/.
     *
     */
    
    app.use(helmet.hsts({
        maxAge: 31536000,
        preload: true
    }))

    /**
     * Adding "Content-Security-Policy: frameancestors 'none'" header
     * This prevents the site to be loaded inside iframes (of any domain)
     * Refer https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors
     * default-src, script-src etc should be changes to specific url, self refer https://github.com/helmetjs/helmet#reference
     * Default src is disable for now, defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc - https://github.com/helmetjs/helmet/issues/237#issuecomment-751515087
     */
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
            frameAncestors: ["'self'"]
        }
    }))

    /****************************
     *  End Security Headers
     ****************************/

    /**
     * Enabling the "trust proxy" setting , express will have knowledge
     * that it's sitting behind a proxy and that the X-Forwarded-* header
     * fields may be trusted
     */
    app.set('trust proxy', true);

    app.use(frameguard({ action: 'sameorigin' }));

    // Use Morgan request logger for AWS ECS
    if (config.app.orchestration === 'ECS') {
        app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" "httpcode"::status :res[content-length] :req[X-Amzn-Trace-Id]'))
    }

    // Support JSON-encoded bodies
    app.use(bodyParser.json({
        limit: '5mb'
    }));

    // handle bodyparser parsing errors
    app.use(bodyParserErrorHandler);

    // Support URL-encoded bodies
    app.use(bodyParser.urlencoded({
        limit: '5mb',
        extended: true
    }));

    // Cookie parser added for csrf library
    app.use(cookieParser())

    const cookieConfig = {};

    // Change cookie domain if app environment is not local
    if (config.app.appEnv != 'local') {
        cookieConfig.secure = true;
        cookieConfig.sameSite = true;
        cookieConfig.httpOnly = true;
        // Change cookie domain if app environment is not local 
        cookieConfig.domain = config.app.session.cookieDomain;
    }

    app.use(session(
        {
            secret: config.app.session.cookieSecret,
            store: new redisStore({ client: redisClient, ttl: config.app.session.ttl }),
            saveUninitialized: false,
            resave: false,
            name: config.app.session.cookiePrefix + 'sid',
            cookie: cookieConfig,
            rolling: true //Express Session Rolling - https://github.com/expressjs/session#rolling
        }
    ));

    // Adding csrf cookie and csrf token for protection against cross site request forgery
    const csrfProtection = csrf({
        cookie: {
            key: "csrf_cookie",
            secure: cookieConfig.secure,
            sameSite: cookieConfig.sameSite,
            httpOnly: cookieConfig.httpOnly
        }
    })

    // Adding in a check so as to exempt the endpoint from the csrf check
    app.use((req, res, next) => {
        if (isCSRFExemptedUrl(req.url, config.app.exemptCSRFendpointList)) {
            return next();
        } else {
            csrfProtection(req, res, next)
        }
    })

    app.use("/", (req, res, next) => {
        if (isCSRFExemptedUrl(req.url, config.app.exemptCSRFendpointList)) {
            return next();
        }
        else {
            res.cookie('csrf-token', req.csrfToken(), { secure: cookieConfig.secure })
            return next();
        }
    })
    
    //Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user)
            done(null, user);
    });
    passport.deserializeUser(function (userObj, done) {
        done(null, userObj);
    });

    // Status for health check by AWS ECS
    // IMPORTANT !!!! Keep This before HTTPS redirect as this route is called over HTTP by AWS Health Check
    app.get('/status', function (req, res) {
        sendAppInitializedMessage(req, res);
    });

    //Redirect to https if configured
    app.use(function (req, res, next) {
        if (config.app.redirectToHttps && !reqUtils.isHttps(req)) {
            res.redirect('https://' + req.headers.host + req.url);
        } else {
            next();
        }
    });

    // To disable client-side caching of backend apigateway calls
    // Refer https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching
    app.use(nocache());

    return app;
};

function serveStaticAssets(app) {
    /**
     * Production Checks
     * 1. Enable GZIP Compression for static assets(JS/CSS etc.)
     * 2. Set cache headers for static assets(JS/CSS files) to tell browsers to cache files.
     * These will not be needed when we start using CDN for serving static assets.
     */
    let staticContentOptions;
    app.use(compression());

    //Skip browser caching for html files
    const skipBrowserCaching = (res, filePath) => {
        const pathArray = filePath.split(".");
        const extension = pathArray[pathArray.length - 1];
        if (["html"].indexOf(extension) != -1) {
            res.setHeader('Cache-Control', 'public, max-age=0');
        } else if (filePath.indexOf('notifications-component') != -1) {
            res.setHeader('Cache-Control', 'public, no-store, max-age=0');
        }
    }

    if (config.app.enableBrowserCache) {
        staticContentOptions = {
            maxAge: config.app.browserCacheMaxAge,
            lastModified: false,
            setHeaders: skipBrowserCaching
        };
    }


    // Accessing the static assets from the dist in production environment
    app.use(express.static(path.resolve(__dirname, './../dist'), staticContentOptions));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './../dist/index.html'));
    });
}

function sendAppInitializedMessage(req, res) {
    if (appGlobals.appInitialized) {
        res.send({
            appInitialized: true, message: 'App has been initialized successfully.'
        });
    }
    else {
        syslog.info({ req }, 'App has not initialized yet.');
        res.status(503).send({
            appInitialized: false,
            message: 'App has not initialized yet.'
        });
    }
}

function isCSRFExemptedUrl(url, exemptCSRFendpointList) {
    return exemptCSRFendpointList != undefined && exemptCSRFendpointList.find(exemptUrl => url.indexOf(exemptUrl)) != -1
}

// Fix for https://owasp.org/www-community/attacks/Full_Path_Disclosure
function bodyParserErrorHandler(err, req, res, next) {
    if (err.type === "entity.parse.failed") {
        errorHandler.handleError(req, res, err, { tag: 'PARSING_ERROR', isFurtherComputationsNeeded: true, errorInfo: err.message });
        res.status(err.statusCode || 400).json('Invalid JSON');
    } else {
        next(err);
    }
}