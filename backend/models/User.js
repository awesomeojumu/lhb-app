const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String},
  sex: { type: String, enum: ["Male", "Female"]},
  ageBracket: { type: String, enum: ["Under 18", "18 - 24", "25 - 30", "31 - 35", "35 above"] },
  dateOfBirth: Date,
  

  battalion: { type: String, enum: ["Alpha", "Bravo", "Charlie", "Delta"] },
  lhbLevel: { type: String, enum: ["Email Community", "Global Soldier", "Special Force", "Commando"] },
  lhbCode: String,

  relationshipStatus: { type: String, enum: ["Single", "Engaged", "Married"] },
  weddingAnniversary: Date,

  address: String,
  country: String,

  personalityType: String,
  fiveFoldGift: { type: String, enum: ["Apostle", "Pastor", "Evangelist", "Teacher", "Prophet"] },
  leadershipRoles: [String],

  education: { type: String, enum: ["SSCE", "OND", "HND", "Bachelors", "Masters", "PhD"] },
  jobStatus: { type: String, enum: ["Employed", "Self Employed", "Contract", "Unemployed"] },
  incomeRange: { type: String },

  purposeStatus: { type: String, enum: ["Yes", "No", "In Progress"] },
  primaryMountain: String,
  secondaryMountain: String,

  purposeBootcampCompleted: Boolean,
  discipleshipCompleted: Boolean,

  hasVoterCard: Boolean,
  hasPassport: Boolean,
  hasDriversLicense: Boolean,

  role: { type: String, enum: ["commander", "commando", "special_force", "soldier"], default: "soldier" },

  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
