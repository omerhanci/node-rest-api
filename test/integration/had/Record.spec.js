var server = require('../../../src/server').server;
var chai = require('chai');
var request = require('supertest');
const expect = chai.expect;

describe('Fetch Filtered Record Tests', function () {
  it('Should get records when called with correct parameters', async function () {

    this.timeout(99999);

    var body = {
      "startDate": "2016-01-06",
      "endDate": "2018-02-22",
      "minCount": 135,
      "maxCount": 150
    }

    var resp = await request(server.app)
      .post('/fetchByCountAndDate')
      .expect("Content-type", 'application/json; charset=utf-8')
      .expect(200)
      .send(body)

    expect(resp.body).to.not.be.null;
    expect(resp.body).to.be.an('object', 'body field must be object');
    expect(resp.body.code).to.equal(0);
    expect(resp.body.msg).to.equal('Success');
    expect(resp.body.records).to.be.an('array', 'records should be an array');


  });

  it('Should return bad request if start date in wrong format', async function () {

    this.timeout(99999);

    var body = {
      "startDate": "2016-01-06",
      "endDate": "2018-02-2",
      "minCount": 135,
      "maxCount": 150
    }

    var resp = await request(server.app)
      .post('/fetchByCountAndDate')
      .expect("Content-type", 'application/json; charset=utf-8')
      .expect(400)
      .send(body)

    expect(resp.body).to.not.be.null;
    expect(resp.body).to.be.an('object', 'body field must be object');
    expect(resp.body.code).to.equal(400);
    expect(resp.body.msg).to.equal('Validation Error');

  });

  it('Should return bad request if end date in wrong format', async function () {

    this.timeout(99999);

    var body = {
      "startDate": "2016-01-6",
      "endDate": "2018-02-22",
      "minCount": 135,
      "maxCount": 150
    }

    var resp = await request(server.app)
      .post('/fetchByCountAndDate')
      .expect("Content-type", 'application/json; charset=utf-8')
      .expect(400)
      .send(body)

    expect(resp.body).to.not.be.null;
    expect(resp.body).to.be.an('object', 'body field must be object');
    expect(resp.body.code).to.equal(400);
    expect(resp.body.msg).to.equal('Validation Error');

  });

  it('Should return bad request if min count in wrong format', async function () {

    this.timeout(99999);

    var body = {
      "startDate": "2016-01-6",
      "endDate": "2018-02-22",
      "minCount": "test",
      "maxCount": 150
    }

    var resp = await request(server.app)
      .post('/fetchByCountAndDate')
      .expect("Content-type", 'application/json; charset=utf-8')
      .expect(400)
      .send(body)

    expect(resp.body).to.not.be.null;
    expect(resp.body).to.be.an('object', 'body field must be object');
    expect(resp.body.code).to.equal(400);
    expect(resp.body.msg).to.equal('Validation Error');

  });

  it('Should return bad request if max count in wrong format', async function () {

    this.timeout(99999);

    var body = {
      "startDate": "2016-01-6",
      "endDate": "2018-02-22",
      "minCount": 120,
      "maxCount": "test"
    }

    var resp = await request(server.app)
      .post('/fetchByCountAndDate')
      .expect("Content-type", 'application/json; charset=utf-8')
      .expect(400)
      .send(body)

    expect(resp.body).to.not.be.null;
    expect(resp.body).to.be.an('object', 'body field must be object');
    expect(resp.body.code).to.equal(400);
    expect(resp.body.msg).to.equal('Validation Error');

  });

});