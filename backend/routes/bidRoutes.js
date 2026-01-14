import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

const router = express.Router();

// Submit a bid
router.post("/", protect, async (req, res) => {
  try {
    const { gigId, amount, proposal } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ msg: "Gig not found" });

    if (gig.ownerId.toString() === req.userId) {
      return res.status(400).json({ msg: "Cannot bid on your own gig" });
    }

    const bid = await Bid.create({ gigId, bidderId: req.userId, amount, proposal });
    res.json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cannot submit bid" });
  }
});

// View bids on a gig

router.get("/gig/:gigId", protect, async (req, res) => {
  try {
    const gigId = req.params.gigId.trim(); 

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ msg: "Invalid Gig ID" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ msg: "Gig not found" });

    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const bids = await Bid.find({ gigId: gig._id }).populate("bidderId", "name email");
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ msg: "Cannot fetch bids", error: err.message });
  }
});



// Hire a freelancer 
router.patch("/:bidId/hire", protect, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let hiredBid;   
    let hiredGig;

    await session.withTransaction(async () => {
      const bid = await Bid.findById(req.params.bidId).session(session);
      if (!bid) throw new Error("Bid not found");

      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) throw new Error("Gig not found");

    
      if (gig.ownerId.toString() !== req.userId) {
        throw new Error("Not authorized");
      }

    
      if (gig.status === "assigned") {
        throw new Error("Gig already assigned");
      }

    
      gig.status = "assigned";
      await gig.save({ session });

      
      await Bid.updateMany(
        { gigId: gig._id },
        { status: "rejected" },
        { session }
      );

      
      bid.status = "accepted";
      await bid.save({ session });

      
      hiredBid = bid;
      hiredGig = gig;
    });

    // SOCKET EVENT 
    const io = req.app.get("io");
    io.to(hiredBid.bidderId.toString()).emit("hired", {
      message: `You have been hired for "${hiredGig.title}"`,
      gigId: hiredGig._id,
    });

    res.json({ msg: "Freelancer hired safely" });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ msg: err.message });
  } finally {
    session.endSession();
  }
});


export default router;
