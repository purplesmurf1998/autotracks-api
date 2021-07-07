const ErrorResponse = require('../middleware/ErrorResponse');
const AsyncHandler = require('../middleware/AsyncHandler');
const Vehicle = require('../models/Vehicle')

// @desc        Get all vehicles
// @route       GET /api/v1/vehicles
// @access      Private
exports.getVehicles = AsyncHandler(async (req, res, next) => {
  // copy req.query
  const reqQuery = { ...req.query };
  // fields to exclude from filtering;
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // loop over fields to remove them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  // build query from any filters in query params
  let query;
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Vehicle.find(JSON.parse(queryStr));
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }
  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Vehicle.countDocuments();
  query = query.skip(startIndex).limit(limit);
  // run query
  const vehicles = await query;
  // pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: vehicles.length,
    pagination,
    data: vehicles
  });
});

// @desc        Get a specific vehicle
// @route       GET /api/v1/vehicles/:vehicleId
// @access      Private
exports.getVehicle = AsyncHandler(async (req, res, next) => {
  // find vehicle
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  // return error if nothing found
  if (!vehicle) {
    return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, data: vehicle });
});

// @desc        Create a new vehicle
// @route       POST /api/v1/vehicles
// @access      Private
exports.createVehicle = AsyncHandler(async (req, res, next) => {
  const newVehicle = await Vehicle.create(req.body);

  res.status(200).json({ success: true, vehicle: newVehicle })
});

// @desc        Update a specific vehicle
// @route       PUT /api/v1/vehicles/:vehicleId
// @access      Private
exports.updateVehicle = AsyncHandler(async (req, res, next) => {
  // find vehicle to update
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, {
    new: true,
    runValidators: true
  });
  // return error if no vehicle found
  if (!vehicle) {
    return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, data: vehicle });
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/vehicles/:vehicleId
// @access      Private
exports.deleteVehicle = AsyncHandler(async (req, res, next) => {
  // find vehicle to delete
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  // return error if no vehicle found
  if (!vehicle) {
    return next(new ErrorResponse(`vehicle not found with id ${req.params.vehicleId}`, 404));
  }
  // delete vehicle
  vehicle.remove();
  // return data
  res.status(200).json({ success: true, data: {} });
});