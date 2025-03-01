const mongoose = require("mongoose");

const AddNriSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Country:{
        type: String,
        required: true,
    },
    Locality:{
        type: String,
        required: true,
    },
    Occupation:{
        type: String,
        required: true,
    },
    MobileIN:{
        type: String,
        required: true,
    },
    MobileCountryNo:{
        type: String,
        required: true,

    },
});

const AddNri = mongoose.model("Nri", AddNriSchema);
module.exports = AddNri;