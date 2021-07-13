const Location = require('../models/Location');
const ErrorResponse = require('../middleware/ErrorResponse');
const AsyncHandler = require('../middleware/AsyncHandler');

// @desc        Get all locations
// @route       GET /api/v1/locations
// @access      Private
exports.getLocations = AsyncHandler(async (req, res, next) => {
    // copy req.query
    const reqQuery = {...req.query};
    // fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // build query from any filters in query params
    let query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Location.find(JSON.parse(queryStr));
    // select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }
    // sort results
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt');
    }
    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Location.countDocuments();
    query = query.skip(startIndex).limit(limit);
    // find locations
    const locations = await query;
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
    // return data
    res.status(200).json({ success: true, count: locations.length, pagination, data: locations });
});

// @desc        Get a location
// @route       GET /api/v1/locations/:id
// @access      Public
exports.getLocation = AsyncHandler(async (req, res, next) => {
    // find location
    const location = await Location.findById(req.params.locationId);
    // return error if nothing found
    if (!location) {
        return next(new ErrorResponse(`location not found with id ${req.params.locationId}`, 404));
    }
    // return data
    res.status(200).json({ success: true, data: location });
});

// @desc        Create a new location
// @route       POST /api/v1/locations
// @access      Private
exports.createLocation = AsyncHandler(async (req, res, next) => {
    // create new location
    const newLocation = await Location.create(req.body);
    // return data
    res.status(201).json({ success: true, data: newLocation });
});

// @desc        Update a location
// @route       PUT /api/v1/locations/:id
// @access      Private
exports.updateLocation = AsyncHandler(async (req, res, next) => {
    // find location to update
    const location = await Location.findByIdAndUpdate(req.params.locationId, req.body, {
        new: true,
        runValidators: true
    });
    // return error if no location found
    if (!location) {
        return next(new ErrorResponse(`Location not found with id ${req.params.locationId}`, 404));
    }
    // return data
    res.status(200).json({ success: true, data: location });
});

// @desc        Delete a location
// @route       DELETE /api/v1/locations/:id
// @access      Private
exports.deleteLocation = AsyncHandler(async (req, res, next) => {
    // find location to delete
    const location = await Location.findById(req.params.locationId);
    // return error if no location found
    if (!location) {
        return next(new ErrorResponse(`Location not found with id ${req.params.locationId}`, 404));
    }
    // delete location
    location.remove();
    // return data
    res.status(200).json({ success: true, data: {} });
});