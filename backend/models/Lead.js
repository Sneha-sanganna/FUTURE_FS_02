const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      enum: ["Website", "Referral", "Social Media", "Advertisement", "Other"],
      default: "Website"
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Lost"],
      default: "New"
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    followUpDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
