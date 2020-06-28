class RecordService {

    constructor(recordRepository) {
        this._recordRepository = recordRepository;
    }

    fetchByCountAndDate(filter) {
        return this._recordRepository.fetchByCountAndDate(filter);
    }


}
exports.RecordService = RecordService;

