const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const AstroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  astro_image: { type: String, required: true },
  languages_known: { type: String, required: true },
  phone_number: { type: String },
  description: { type: String, required: true },
  experience: { type: Number, required: true },
  reviews: { type: [ReviewSchema], default: [] },
  chat_number: { type: String },
  status: { type: String, required: true },
  skills: { type: String, required: true },
  chat_price_per_minute: { type: Number, required: true },
  call_price_per_minute: { type: Number, required: true },
});

AstroSchema.virtual("overall_rating").get(function () {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1); 
});

AstroSchema.set("toJSON", { virtuals: true });
AstroSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Astro", AstroSchema);
