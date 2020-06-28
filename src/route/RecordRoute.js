var express = require('express');
const router = express.Router();
const _BaseRoute = require('./base/BaseRoute');
const TYPES = require('../conf/types').TYPES;

class RecordRoute extends _BaseRoute.BaseRoute {
    
    static getRoutes(container) {
        
        let validator = container.get(TYPES.Validator);

        router.post("/fetchByCountAndDate", validator('FetchByCountAndDate'), (req, res, next) => {
            let r = container.get(TYPES.RecordRoute)(req, res, next);
            return r.wrap(() => r.fetchByCountAndDate());
        });

        return router;
    }

    constructor(req, res, next, recordService) {
        super(req, res, next);
        this._recordService = recordService;
    }

    fetchByCountAndDate() {
        return this._recordService.fetchByCountAndDate(this.body).catch(err => {
            return err;
        });
    }
}

exports.RecordRoute = RecordRoute;