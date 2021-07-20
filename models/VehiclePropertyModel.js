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
    unique: [true, 'Vehicle property data field must be unique']
  },
  inputType: {
    type: String,
    enum: ['Text', 'Currency', 'Date', 'Options', 'List'],
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

// Create the field from the headerName
VehiclePropertyModelSchema.pre('save', async function (next) {
  // create field
  this.field = this.headerName.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });;
  next();
});

module.exports = mongoose.model('VehiclePropertyModel', VehiclePropertyModelSchema);