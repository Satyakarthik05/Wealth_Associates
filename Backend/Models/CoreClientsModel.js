const mongoose = require("mongoose");

const CoreClientsSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    officeAddress: { type: String, required: true },
    city: { type: String, required: true },
    website: { type: String, required: true },
    photo: { type: String, required: true }, // agent, coreMember, customerMember, admin
    editedAt: { type: Date }, // Stores the last edit timestamp
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const CoreClients = mongoose.model("CoreClient", CoreClientsSchema);

module.exports = CoreClients;
