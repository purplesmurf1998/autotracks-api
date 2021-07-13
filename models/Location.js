const mongoose = require('mongoose');
const geocoder = require('../middleware/Geocoder')

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Location name is a required field'],
        unique: true,
        trim: true,
        maxlength: [50, 'Location name cannot be more than 50 characters']
    },
    description: String,
    address: {
        type: String,
        required: [true, 'Location address is a required field']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    }
});

// Geocode and create location field
LocationSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: `${loc[0].streetNumber} ${loc[0].streetName}`,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // Do not save address in DB
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Location', LocationSchema);