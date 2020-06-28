require("dotenv").load();
var http = require('http');
const express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var _ = require('lodash');
require("reflect-metadata");
var Ajv = require('ajv');
var path = require('path');
var fs  = require('fs');

const TYPES = require('./conf/types').TYPES;

var _DataAccess = require('./data/DataAccess');
var inversify = require('inversify');
var helpers = require('inversify-vanillajs-helpers').helpers;
var _RecordRoute = require('./route/RecordRoute');
var _RecordRepository = require('./data/repository/RecordRepository');
var _RecordService = require('./service/RecordService');

/**
 * The server.
 *
 * @class Server
 */
class Server {

    static bootstrap() {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // create expressjs application
        this.app = express();

        // configure ajv to validate data
        this.configureValidator();

        // configure application
        this.config().then(() => this.postConfig()).catch((err) => {
            winston.log('error', "Configuration error ", err);
            setTimeout(() => {
                process.exit(1);
            }, 10000);
        });
    }

    postConfig() {
        this.initializeMongoInstance();
        // add routes
        this.registerRoutes();
        this.configureErrorHandler();
        // Create server
        this.server = http.createServer(this.app);
        // Start listening
        this.listen();
    }

    initializeMongoInstance() {
        _DataAccess.setMongoConnection();
    };

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {

        this.port = process.env.PORT || 3000;

        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.configureDependencyInjection();

        return Promise.resolve();
    }

    configureErrorHandler() {
        var that = this;
        this.app.use(function (err, req, res, next) {
            var statusCode = 500;
            console.error(err);

            winston.log("error", "Express error handler", err);
            res.status(statusCode).json({
                message: 'Sorry, there is an internal problem right now, please try again later'
            });

            next();
        });
    }

    configureDependencyInjection() {

        // Configure Inversify
        this._container = new inversify.Container();
        var register = helpers.register(this._container);
        var registerFactory = helpers.registerFactory(this._container);
        var registerConstantValue = helpers.registerConstantValue(this._container);
        registerConstantValue(TYPES.Validator, this._validator);

        // Register injections
        register(TYPES.RecordRepository)(_RecordRepository.RecordRepository);
        register(TYPES.RecordService, [TYPES.RecordRepository])(_RecordService.RecordService);

        // we must use factory methods on routes to get req,res,next
        registerFactory(TYPES.RecordRoute, (context) => {
            return (req, res, next) => {
                let rs = context.container.get(TYPES.RecordService);
                return new _RecordRoute.RecordRoute(req, res, next, rs);
            };
        });
    }

    configureValidator() {

        let ajv = new Ajv({$data: true});

        // List all files in a directory in Node.js recursively in a synchronous fashion
        var walkSync = function(dir) {
            var files = fs.readdirSync(dir);
            files.forEach(function(file) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    walkSync(path.join(dir, file));
                }
                else {
                    if (file.endsWith('.schema.json')) {
                        var schemaName = file.substring(0,file.lastIndexOf('.schema.json'));
                        var schema = require(path.join(dir, file));
                        ajv.addSchema(schema, schemaName);
                    }
                }
            });
        };

        walkSync(path.join(__dirname, "data", "schemas"));

        var errorResponse = (schemaErrors) => {
            let errors = schemaErrors.map((error) => {
                return {
                    field: error.dataPath,
                    message: error.message
                };
            });

            return {
                code: 400,
                msg: "Validation Error",
                errors: errors
            };
        };

        this._validator = (schemaName) => {
            return (req, res, next) => {
                let valid = ajv.validate(schemaName, req.body);
                if (!valid) {
                    return res.status(400).send(errorResponse(ajv.errors));
                }
                next();
            }
        };
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    registerRoutes() {

        this.app.use('/healthcheck', function (req, res, next) {
            res.send('alive!');
        });
        this.app.use("/", _RecordRoute.RecordRoute.getRoutes(this._container));
    }

    // Start HTTP server listening
    listen() {
        // listen on provided ports
        this.server.listen(this.port);

        // add error handler
        this.server.on("error", error => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof this.port === 'string'
                ? 'Pipe ' + this.port
                : 'Port ' + this.port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    winston.log("error", ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    winston.log("error", bind + ' is already in use');
                    process.exit(1);
                    break;

                default:
                    winston.log("error", 'Server Error', error);
                    throw error;
            }
        });

        // start listening on port
        this.server.on("listening", () => {
            winston.log("info", "Server ready. Listening on port " + this.port + ". Open up http://localhost:" + this.port + "/ in your browser.");
        });

    }

}

// Bootstrap the server
let server = Server.bootstrap();
exports.server = server;
