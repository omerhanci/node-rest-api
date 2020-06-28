const crypto = require('crypto');
var _ = require('lodash');
var winston = require('winston');

const UNUSUAL_PAIR = 2;

class RecordService {

    constructor(recordRepository) {
        this._recordRepository = recordRepository;
    }

    fetchByCountAndDate(filter) {
        return this._recordRepository.fetchByCountAndDate(filter);
    }


}

exports.RecordService = RecordService;

