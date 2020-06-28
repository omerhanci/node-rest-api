class BaseRoute {

    constructor(req, res, next) {
        this._req = req;
        this._res = res;
        this._next = next;
    }

    get query(){
      return this._req.query;
    }

    get body(){
        return this._req.body;
    }

    success(response) {
        this._res.status(200).send({
            code: 0,
            msg: 'Success',
            records: response
          });
    }

    error(data, statusCode) {
        statusCode = statusCode ? statusCode : 500;
        this._res.status(statusCode).json(data);
    }
    
    wrap(action) {
        Promise.resolve(action()).then(res => {
            this.success(res);
        }).catch(err => {
            this._next(err);
        });
    }

}

exports.BaseRoute = BaseRoute;