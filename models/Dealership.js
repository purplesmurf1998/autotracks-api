const mongoose = require('mongoose');

const DealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dealership name is a required field'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Dealership description is a required field']
  },
  address: String,
  city: String,
  province: String
});

// Cascade delete upon deletion of dealership
DealershipSchema.pre('remove', async function (next) {
  console.log('Cascade delete items associated to dealership');
  // Delete all users for this dealership
  await this.model('User').deleteMany({ dealership: this._id });
  next();
});

module.exports = mongoose.model('Dealership', DealershipSchema);