const expertModel = require("../Models/ExpertModel");

const registerExpert = async (req, res) => {
  const {
    Name,
    Experttype,
    Qualification,
    Experience,
    Locations,
    Mobile,
    // Dynamically include other fields based on Experttype
    specialization, // For LEGAL, REVENUE, BANKING, AUDITING, REGISTRATION & DOCUMENTATION
    barCouncilId, // For LEGAL
    courtAffiliation, // For LEGAL
    lawFirm, // For LEGAL
    landTypeExpertise, // For REVENUE
    govtApproval, // For REVENUE, BANKING, AUDITING, REGISTRATION & DOCUMENTATION
    certificationNumber, // For REVENUE, ENGINEERS, AUDITING, LIAISONING
    organization, // For REVENUE, ENGINEERS, SURVEY, VAASTU PANDITS, LAND VALUERS, AGRICULTURE, AUDITING, LIAISONING
    servicesProvided, // For REVENUE, AGRICULTURE, LIAISONING
    engineeringField, // For ENGINEERS
    certifications, // For ENGINEERS, VAASTU PANDITS, AGRICULTURE
    projectsHandled, // For ENGINEERS
    specializedSkills, // For ENGINEERS
    majorProjects, // For ENGINEERS, ARCHITECTS, SURVEY
    govtLicensed, // For ENGINEERS
    architectureType, // For ARCHITECTS (using 'specialisation' in frontend)
    softwareUsed, // For ARCHITECTS
    licenseNumber, // For ARCHITECTS, SURVEY, LAND VALUERS, LIAISONING
    firmName, // For ARCHITECTS
    surveyType, // For SURVEY
    govtCertified, // For SURVEY, REGISTRATION & DOCUMENTATION, AUDITING
    vaastuSpecialization, // For VAASTU PANDITS
    remediesProvided, // For VAASTU PANDITS
    consultationMode, // For VAASTU PANDITS
    valuationType, // For LAND VALUERS
    govtApproved, // For LAND VALUERS, BANKING
    valuationMethods, // For LAND VALUERS
    bankingService, // For BANKING
    registeredWith, // For BANKING
    institutionName, // For BANKING
    agricultureType, // For AGRICULTURE
    cropTypes, // For AGRICULTURE
    documentType, // For REGISTRATION & DOCUMENTATION
    processingTime, // For REGISTRATION & DOCUMENTATION
    additionalServices, // For REGISTRATION & DOCUMENTATION
    auditType, // For AUDITING
    auditServices, // For AUDITING
    specialisations, // For LIAISONING (using 'specialisations' in frontend)
    // Add more fields as needed for other expert types
  } = req.body;

  let photoPath = null;
  if (req.file) {
    photoPath = `/ExpertMembers/${req.file.filename}`;
  } else {
    return res.status(400).json({ message: "Photo is required." });
  }

  const expertData = {
    Name,
    Experttype,
    Qualification,
    Experience,
    Locations,
    Mobile,
    photo: photoPath,
    specialization,
    barCouncilId,
    courtAffiliation,
    lawFirm,
    landTypeExpertise,
    govtApproval,
    certificationNumber,
    organization,
    servicesProvided,
    engineeringField,
    certifications,
    projectsHandled,
    specializedSkills,
    majorProjects,
    govtLicensed,
    architectureType,
    softwareUsed,
    licenseNumber,
    firmName,
    surveyType,
    govtCertified,
    vaastuSpecialization,
    remediesProvided,
    consultationMode,
    valuationType,
    govtApproved,
    valuationMethods,
    bankingService,
    registeredWith,
    institutionName,
    agricultureType,
    cropTypes,
    documentType,
    processingTime,
    additionalServices,
    auditType,
    auditServices,
    specialisations,
  };

  const newExpert = new Expert(expertData);

  try {
    await newExpert.save();
    res.status(201).json({ message: "Expert Registered successfully" });
  } catch (error) {
    console.error("Error registering expert:", error);
    res
      .status(500)
      .json({ message: "Failed to register expert", error: error.message });
  }
};

const getExpertsByType = async (req, res) => {
  try {
    const { expertType } = req.params;
    const experts = await expertModel.find({ Experttype: expertType });

    if (experts.length > 0) {
      res.status(200).json({ success: true, experts });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No experts found for this type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const modifyExpert = async (req, res) => {
  const { id } = req.params; // Get the expert ID from the URL params
  const {
    Name,
    Experttype,
    Qualification,
    Experience,
    Locations,
    Mobile,
    specialization, // For LEGAL, REVENUE, BANKING, AUDITING, REGISTRATION & DOCUMENTATION
    barCouncilId, // For LEGAL
    courtAffiliation, // For LEGAL
    lawFirm, // For LEGAL
    landTypeExpertise, // For REVENUE
    govtApproval, // For REVENUE, BANKING, AUDITING, REGISTRATION & DOCUMENTATION
    certificationNumber, // For REVENUE, ENGINEERS, AUDITING, LIAISONING
    organization, // For REVENUE, ENGINEERS, SURVEY, VAASTU PANDITS, LAND VALUERS, AGRICULTURE, AUDITING, LIAISONING
    servicesProvided, // For REVENUE, AGRICULTURE, LIAISONING
    engineeringField, // For ENGINEERS
    certifications, // For ENGINEERS, VAASTU PANDITS, AGRICULTURE
    projectsHandled, // For ENGINEERS
    specializedSkills, // For ENGINEERS
    majorProjects, // For ENGINEERS, ARCHITECTS, SURVEY
    govtLicensed, // For ENGINEERS
    architectureType, // For ARCHITECTS (using 'specialisation' in frontend)
    softwareUsed, // For ARCHITECTS
    licenseNumber, // For ARCHITECTS, SURVEY, LAND VALUERS, LIAISONING
    firmName, // For ARCHITECTS
    surveyType, // For SURVEY
    govtCertified, // For SURVEY, REGISTRATION & DOCUMENTATION, AUDITING
    vaastuSpecialization, // For VAASTU PANDITS
    remediesProvided, // For VAASTU PANDITS
    consultationMode, // For VAASTU PANDITS
    valuationType, // For LAND VALUERS
    govtApproved, // For LAND VALUERS, BANKING
    valuationMethods, // For LAND VALUERS
    bankingService, // For BANKING
    registeredWith, // For BANKING
    institutionName, // For BANKING
    agricultureType, // For AGRICULTURE
    cropTypes, // For AGRICULTURE
    documentType, // For REGISTRATION & DOCUMENTATION
    processingTime, // For REGISTRATION & DOCUMENTATION
    additionalServices, // For REGISTRATION & DOCUMENTATION
    auditType, // For AUDITING
    auditServices, // For AUDITING
    specialisations, // For LIAISONING (using 'specialisations' in frontend)
    // Add more fields as needed for other expert types
  } = req.body; // Get updated data from the request body

  const updateData = {
    Name,
    Experttype,
    Qualification,
    Experience,
    Locations,
    Mobile,
    specialization,
    barCouncilId,
    courtAffiliation,
    lawFirm,
    landTypeExpertise,
    govtApproval,
    certificationNumber,
    organization,
    servicesProvided,
    engineeringField,
    certifications,
    projectsHandled,
    specializedSkills,
    majorProjects,
    govtLicensed,
    architectureType,
    softwareUsed,
    licenseNumber,
    firmName,
    surveyType,
    govtCertified,
    vaastuSpecialization,
    remediesProvided,
    consultationMode,
    valuationType,
    govtApproved,
    valuationMethods,
    bankingService,
    registeredWith,
    institutionName,
    agricultureType,
    cropTypes,
    documentType,
    processingTime,
    additionalServices,
    auditType,
    auditServices,
    specialisations,
  };

  // Handle photo update if a new file is provided
  if (req.file) {
    updateData.photo = `/ExpertMembers/${req.file.filename}`;
  }

  try {
    const updatedExpert = await Expert.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (updatedExpert) {
      res.status(200).json({
        success: true,
        message: "Expert updated successfully",
        expert: updatedExpert,
      });
    } else {
      res.status(404).json({ success: false, message: "Expert not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during expert update",
      error: error.message,
    });
  }
};

const deleteExpert = async (req, res) => {
  const { id } = req.params; // Get the expert ID from the URL params

  try {
    const deletedExpert = await expertModel.findByIdAndDelete(id);

    if (deletedExpert) {
      res.status(200).json({
        success: true,
        message: "Expert deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Expert not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerExpert,
  getExpertsByType,
  modifyExpert,
  deleteExpert,
};
