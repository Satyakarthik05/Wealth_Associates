const mongoose = require("mongoose");

const AddExpertSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Qualification:{
        type: String,
        required: true,
    },
    Experience:{
        type: String,
        required: true,
    },
    Location:{
        type: String,
        required: true,
    },
    Mobile:{
        type: String,
        required: true,
    },
    ExpertType:{
        type: String,
        required: true,

    },
});

const AddExpert = mongoose.model("Experts", AddExpertSchema);
module.exports = AddExpert;