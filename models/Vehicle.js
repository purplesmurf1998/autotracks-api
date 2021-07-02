const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  isSold: {
    type: Boolean,
    default: false
  },
  isDelivered: {
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
  model: String,
  intColor: String,
  extColor: String,
  options: [String],
  orderNumber: String,
  serialNumber: String,
  stockNumber: String,
  arrivedAt: Date,
  inServiceSince: Date,
  outOfServiceSince: Date,
  warrantyStart: Date,
  km: Number,
  kos: String
});

module.exports = mongoose.model('Vehicle', VehicleSchema);