import express from "express";
import Gig from "../models/Gig.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create Gig
router.post("/", protect, async (req, res) => {
  try {
    const gig = await Gig.create({ ...req.body, ownerId: req.userId });
    res.json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cannot create gig" });
  }
});

// Get all gigs (search optional)
router.get("/", async (req, res) => {
  try {
    const query = { 
      status: "open", 
      title: { $regex: req.query.search || "", $options: "i" } 
    };
    const gigs = await Gig.find(query).populate("ownerId", "name email");
    res.json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cannot fetch gigs" });
  }
});

// Get single gig
router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");
    if (!gig) return res.status(404).json({ msg: "Gig not found" });
    res.json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cannot fetch gig" });
  }
});

export default router;
