const ErrorResponse = require('../middleware/ErrorResponse');
const AsyncHandler = require('../middleware/AsyncHandler');
const VehiclePropertyModel = require('../models/VehiclePropertyModel')

// @desc        Get all vehicle property models for a specific dealership
// @route       GET /api/v1/dealerships/:dealershipId/vehicles/properties/models
// @access      Private
exports.getVehiclePropertyModels = AsyncHandler(async (req, res, next) => {
  // build query
  let query = VehiclePropertyModel.find({ dealership: req.query.dealershipId });
  // sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('position');
  }
  // run query
  const vehicleProperties = await query;

  res.status(200).json({
    success: true,
    count: vehicleProperties.length,
    data: vehicleProperties
  });
});

// @desc        Create a new vehicle property model
// @route       POST /api/v1/vehicles/properties/models
// @access      Private
exports.createVehiclePropertyModel = AsyncHandler(async (req, res, next) => {
  const numProperties = await VehiclePropertyModel.find({ dealership: req.body.dealership });
  const position = numProperties.length + 1;
  req.body.position = position;
  const newVehicleProperty = await VehiclePropertyModel.create(req.body);

  res.status(200).json({ success: true, vehiclePropertyModel: newVehicleProperty })
});

// @desc        Update a specific vehicle property model
// @route       PUT /api/v1/vehicles/properties/models/:modelId
// @access      Private
exports.updateVehiclePropertyModel = AsyncHandler(async (req, res, next) => {
  // find vehicle property model to update
  const vehicleProperty = await VehiclePropertyModel.findByIdAndUpdate(req.params.modelId, req.body, {
    new: true,
    runValidators: true
  });
  // return error if no vehicle found
  if (!vehicleProperty) {
    return next(new ErrorResponse(`Vehicle property not found with id ${req.params.modelId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, data: vehicleProperty });
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/dealerships/:dealershipId/vehicles/properties/models/:modelId
// @access      Private
exports.deleteVehiclePropertyModel = AsyncHandler(async (req, res, next) => {
  // find vehicle property to delete
  const vehicleProperty = await VehiclePropertyModel.findById(req.params.modelId);
  // return error if no vehicle found
  if (!vehicleProperty) {
    return next(new ErrorResponse(`Vehicle property not found with id ${req.params.modelId}`, 404));
  }
  // delete vehicle
  vehicleProperty.remove();
  // cascade positions for every property above the deleted property
  
  // return data
  res.status(200).json({ success: true, data: {} });
});