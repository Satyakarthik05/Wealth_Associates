const mongoose = require("mongoose");

const AddSkillSchema = new mongoose.Schema({
    FullName:{
        type: String,
        required: true,
    },
    SelectSkill:{
        type: String,
        required: true,
    },
    Location:{
        type: String,
        required: true,
    },
    MobileNumber:{
        type: String,
        required: true,
    },
});

const AddSkill = mongoose.model("Skill", AddSkillSchema);
module.exports = AddSkill;