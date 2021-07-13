const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  sold: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  },
  soldBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle must be property of a dealership']
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location'
  },
  properties: {}
});

module.exports = mongoose.model('Vehicle', VehicleSchema);