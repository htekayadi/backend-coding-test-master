/**
 * Validate user input fields of a new ride.
 * @param {*} rideRequest - Data related to the new ride to be added
 * @returns 
 */
function validateRideRequest(rideRequest) {
  const startLatitude = Number(rideRequest.start_lat);
  const startLongitude = Number(rideRequest.start_long);
  const endLatitude = Number(rideRequest.end_lat);
  const endLongitude = Number(rideRequest.end_long);
  const riderName = rideRequest.rider_name;
  const driverName = rideRequest.driver_name;
  const driverVehicle = rideRequest.driver_vehicle;

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return {
      error_code: 'VALIDATION_ERROR',
      message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
    };
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return {
      error_code: 'VALIDATION_ERROR',
      message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
    };
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return {
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string'
    };
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return {
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string'
    };
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return {
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string'
    };
  }

  return {
    error_code: null,
  };
}

module.exports.validateRideRequest = validateRideRequest;