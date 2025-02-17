const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  name: String,
  code: String,
});

const District = mongoose.model("District", districtSchema);

// Insert Initial Data (Run this only once to populate data)
const initialDistricts = [
  { name: "Select District", code: "" },
  { name: "Araku", code: "01" },
  { name: "Srikakulam", code: "02" },
  { name: "Vizianagaram", code: "03" },
  { name: "Visakhapatnam", code: "04" },
  { name: "Anakapalli", code: "05" },
  { name: "Kakinada", code: "06" },
  { name: "Amalapuram", code: "07" },
  { name: "Rajahmundry", code: "08" },
  { name: "Narasapuram", code: "09" },
  { name: "Eluru", code: "10" },
  { name: "Machilipatnam", code: "11" },
  { name: "Vijayawada", code: "12" },
  { name: "Guntur", code: "13" },
  { name: "Narasaraopet", code: "14" },
  { name: "Bapatla", code: "15" },
  { name: "Ongole", code: "16" },
  { name: "Nandyal", code: "17" },
  { name: "Kurnool", code: "18" },
  { name: "Anantapur", code: "19" },
  { name: "Hindupur", code: "20" },
  { name: "Kadapa", code: "21" },
  { name: "Nellore", code: "22" },
  { name: "Tirupati", code: "23" },
  { name: "Rajampet", code: "24" },
  { name: "Chittoor", code: "25" },
];

// Function to insert districts only if the collection is empty
const insertDataIfEmpty = async () => {
  try {
    const count = await District.countDocuments();
    if (count === 0) {
      await District.insertMany(initialDistricts);
      console.log("Districts added to DB");
    } else {
      console.log("Districts already exist in DB");
    }
  } catch (error) {
    console.error("Error inserting districts:", error);
  }
};

module.exports = { insertDataIfEmpty, District };
