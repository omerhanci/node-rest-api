const dbConn = require('./../DataAccess').dbConn;
var Records = require('../model/records')

class RecordRepository {

    fetchByCountAndDate(filter) {
        return Records.aggregate([
            {
                $addFields: {
                    totalCount: { $sum: "$counts" }
                }
            },
            // filter for createdAt and totalCount
            {
                $match: {
                    createdAt: {
                        $gte: new Date(filter.startDate),
                        $lte: new Date(filter.endDate)
                    },
                    totalCount: {
                        $gte: parseInt(filter.minCount),
                        $lte: parseInt(filter.maxCount)
                    },
                }
            },
            // set projection
            {
                $project: {
                    _id: 0,
                    key: 1,
                    createdAt: 1,
                    totalCount: 1
                }
            }
        ]).exec();

    }
}

exports.RecordRepository = RecordRepository;