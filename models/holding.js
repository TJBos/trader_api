const { Schema, model } = require("mongoose");

//Schema
const holdingSchema = new Schema(
  {
    ticker: { type: String, uppercase: true, required: true },
    name: String,
    shares: { type: Number, required: true, min: 0 },
    dollarValue: { type: Number, required: true, min: 0 },
    costbasePerShare: { type: Number, min: 0 },
    user: String,
  },
  { timestamps: true }
);

//DOG MODEL
const Holding = model("holding", holdingSchema);

//EXPORT MODEL
module.exports = Holding;
