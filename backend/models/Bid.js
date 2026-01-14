import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  proposal: { type: String },
  status: { type: String, default: "pending" } 
}, { timestamps: true });

export default mongoose.model("Bid", BidSchema);
