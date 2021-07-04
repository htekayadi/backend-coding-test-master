module.exports = (db) => {
  async function addNewRide(values) {
    try {
      return await db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values);
    } catch (error) {
      return {
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      };
    }
  }

  async function retrieveRide(rideId) {
    try {
      const result = await db.all('SELECT * FROM Rides WHERE rideID = ?', rideId);

      if (result.length === 0) {
        return {
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        };
      }

      return result;
    } catch (error) {
      return {
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      };
    }
  }

  return { addNewRide, retrieveRide };
}