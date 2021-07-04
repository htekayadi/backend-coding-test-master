'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides', () => {
        it('should return 404 not found', (done) => {
            request(app)
                .get('/rides')
                .expect(404, done);
        });
    });

    describe('POST /rides', () => {
        it('should return 400 Bad Request (invalid start latitude)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 200,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid start longitude)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 200,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid start latitude)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 200,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid start longitude)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 200,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid rider name)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid driver name)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(400, done);
        });
        it('should return 400 Bad Request (invalid driver vehicle)', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: ""
                })
                .expect(400, done);
        });
        it('should return 500 in case of server error', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01",
                    expect_error: true
                })
                .expect(500, done);
        });
        it('should insert rides successfully', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(200, done);
        });
    });

    describe('GET /rides', () => {
        it('should return rides', (done) => {
            request(app)
                .get('/rides')
                .expect(200, done);
        });
        it('should return rides with default pagination (page: 0, per_page: 10)', (done) => {
            request(app)
                .get('/rides')
                .expect(200)
                .then((resp) => {
                    return resp.body.length === 2;
                });

            done();
        });
        it('should return 500 internal server error', (done) => {
            request(app)
                .get('/rides?page=0&per_page=1;%20DROP%20TABLE%20users')
                .expect(500, done);
        });
        it('should return rides with pagination request (page: 0, per_page: 1)', (done) => {
            request(app)
                .get('/rides?page=0&item_per_page=1')
                .expect(200)
                .then((resp) => {
                    return resp.body.length === 1;
                });

            done();
        });
    });
    
    describe('GET /rides/:id', () => {
        it('should return 404 not found', (done) => {
            request(app)
                .get('/rides/9999')
                .expect(404, done);
        });
        it('should return 404 not found (no rides with id=1%20OR%201=1)', (done) => {
            request(app)
                .get('/rides/1%20OR%201=1')
                .expect(404, done)
        })
        it('should return 404 not found (no rides with id=1%20or%20""="")', (done) => {
            request(app)
                .get('/rides/1%20or%20""=""')
                .expect(404, done)
        })
        it('should return a ride', (done) => {
            request(app)
                .post('/rides')
                .set('Content-type', 'application/json')
                .send({
                    start_lat: 0,
                    start_long: 0,
                    end_lat: 10,
                    end_long: 10,
                    rider_name: "Rider 01",
                    driver_name: "Driver 01",
                    driver_vehicle: "Vehicle 01"
                })
                .expect(200);
            
            request(app)
                .get('/rides/1')
                .expect(200, done);
        });
    });
});