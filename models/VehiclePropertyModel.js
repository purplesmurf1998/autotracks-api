const mongoose = require('mongoose')

const VehiclePropertyModelSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle property model must be associated to a dealership']
  },
  text: {
    type: String,
    required: [true, 'Vehicle property must have a title']
  },
  dataField: {
    type: String,
    required: [true, 'Vehicle property must have a data name'],
    unique: [true, 'Vehicle property datafield must be unique']
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
  }
});

module.exports = mongoose.model('VehiclePropertyModel', VehiclePropertyModelSchema);