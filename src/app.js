'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { validateRideRequest } = require('./helper');
const initRidesService = require('./services/rides.js');

const jsonParser = bodyParser.json();

module.exports = (db) => {
  const ridesService = initRidesService(db);

  app.get('/health', (req, res) => res.send('Healthy'));

  app.post('/rides', jsonParser, async (req, res) => {
    const validationResult = validateRideRequest(req.body);

    if (validationResult.error_code) {
      return res.status(400).send(validationResult);
    }

    const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
    const newRideResult = await ridesService.addNewRide(values);

    if (newRideResult.error_code) {
      return res.send(newRideResult);
    }

    const newRide = await ridesService.retrieveRide(newRideResult.lastID);

    return res.send(newRide);
  });

  app.get('/rides', (req, res) => {
    let {page, per_page} = req.query;
    if (!page) {
      page = 0;
    }
    if (!per_page) {
      per_page = 10;
    }

    db.all('SELECT * FROM Rides LIMIT $per_page OFFSET $offset', {
      $per_page: per_page,
      $offset: page * per_page,
    }, function(err, rows) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  app.get('/rides/:id', (req, res) => {
    db.all('SELECT * FROM Rides WHERE rideID=$id', {
      $id: req.params.id
    }, function(err, rows) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  return app;
};
