const router = require('express').Router();
const {
  getVehiclePropertyModels,
  createVehiclePropertyModel,
  updateVehiclePropertyModel,
  deleteVehiclePropertyModel
} = require('../controllers/vehicleProperties');

router.route('/')
  .post(createVehiclePropertyModel)
  .get(getVehiclePropertyModels);

router.route('/:modelId')
  .put(updateVehiclePropertyModel)
  .delete(deleteVehiclePropertyModel);

module.exports = router;