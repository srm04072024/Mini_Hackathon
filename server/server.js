const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: Number,
  raised: { type: Number, default: 0 },
  image: String,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

// Routes
app.get("/api/campaigns", async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

app.post("/api/campaigns", async (req, res) => {
  const { title, description, goal, image } = req.body;
  const newCampaign = new Campaign({ title, description, goal, image });
  await newCampaign.save();
  res.status(201).json(newCampaign);
});

app.post("/api/campaigns/donate/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const campaign = await Campaign.findById(id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  campaign.raised += amount;
  await campaign.save();
  res.json(campaign);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
