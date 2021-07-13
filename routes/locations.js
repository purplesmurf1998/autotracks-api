const router = require('express').Router();
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locations');

router.route('/')
  .post(createLocation)
  .get(getLocations);

router.route('/:locationId')
  .get(getLocation)
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;