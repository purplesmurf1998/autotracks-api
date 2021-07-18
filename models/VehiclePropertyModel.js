const mongoose = require('mongoose')

const VehiclePropertyModelSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle property model must be associated to a dealership']
  },
  headerName: {
    type: String,
    required: [true, 'Vehicle property must have a header name']
  },
  field: {
    type: String,
    required: [true, 'Vehicle property must have a data field name'],
    unique: [true, 'Vehicle property data field must be unique']
  },
  inputType: {
    type: String,
    enum: ['Text', 'Currency', 'Date', 'Option', 'List'],
    required: [true, 'Vehicle property must have an input type']
  },
  options: [String],
  mobileList: {
    type: Boolean,
    default: true
  },
  inventoryList: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    required: [true, 'Vehicle property model must have a position']
  },
  isRequired: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('VehiclePropertyModel', VehiclePropertyModelSchema);