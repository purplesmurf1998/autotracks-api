const router = require('express').Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicles');

router.route('/')
  .post(createVehicle)
  .get(getVehicles);

router.route('/:vehicleId')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;