const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      default: 45,
      min: 10,
    },
    monthlyFee: {
      type: Number,
      default: 120,
      min: 0,
    },
    stops: [String],
  },
  { timestamps: true }
);

transportRouteSchema.index({ vehicleNumber: 1 });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);
