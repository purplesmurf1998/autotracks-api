const ErrorResponse = require('../middleware/ErrorResponse');
const AsyncHandler = require('../middleware/AsyncHandler');
const Dealership = require('../models/Dealership')

// @desc        Get all dealerships
// @route       GET /api/v1/dealerships
// @access      Private
exports.getDealerships = AsyncHandler(async (req, res, next) => {
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
  query = Dealership.find(JSON.parse(queryStr));
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
  const total = await Dealership.countDocuments();
  query = query.skip(startIndex).limit(limit);
  // run query
  const dealerships = await query;
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
    count: dealerships.length,
    pagination,
    data: dealerships
  });
});

// @desc        Get a specific dealership
// @route       GET /api/v1/dealerships/:dealershipId
// @access      Private
exports.getDealership = AsyncHandler(async (req, res, next) => {
  // find dealership
  const dealership = await Dealership.findById(req.params.dealershipId);
  // return error if nothing found
  if (!dealership) {
    return next(new ErrorResponse(`Dealership not found with id ${req.params.dealershipId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, data: dealership });
});

// @desc        Create a new dealership
// @route       POST /api/v1/dealerships
// @access      Private
exports.createDealership = AsyncHandler(async (req, res, next) => {
  const newDealership = await Dealership.create(req.body);

  res.status(200).json({ success: true, dealership: newDealership })
});

// @desc        Update a specific dealership
// @route       PUT /api/v1/dealerships/:dealershipId
// @access      Private
exports.updateDealership = AsyncHandler(async (req, res, next) => {
  // find dealership to update
  const dealership = await Dealership.findByIdAndUpdate(req.params.dealershipId, req.body, {
    new: true,
    runValidators: true
  });
  // return error if no dealership found
  if (!dealership) {
    return next(new ErrorResponse(`Dealership not found with id ${req.params.portId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, data: dealership });
});

// @desc        Delete a specific dealership
// @route       DELETE /api/v1/dealerships/:dealershipId
// @access      Private
exports.deleteDealership = AsyncHandler(async (req, res, next) => {
  // find dealership to delete
  const dealership = await Dealership.findById(req.params.dealershipId);
  // return error if no dealership found
  if (!dealership) {
    return next(new ErrorResponse(`Dealership not found with id ${req.params.portId}`, 404));
  }
  // delete dealership
  dealership.remove();
  // return data
  res.status(200).json({ success: true, data: {} });
});