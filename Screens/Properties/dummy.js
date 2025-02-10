const handlePost = async () => {
  if (validateForm()) {
    try {
      let response;
      if (Platform.OS === "web") {
        // Web sends JSON with Base64 image
        response = await fetch(`${API_URL}/properties/addProperty`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyType,
            location,
            price,
            photo, // This will be Base64 from the web
          }),
        });
      } else {
        // For mobile (FormData)
        const formData = new FormData();
        formData.append("propertyType", propertyType);
        formData.append("location", location);
        formData.append("price", price);
        formData.append("photo", {
          uri: photo,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        console.log(formData);

        response = await fetch(`${API_URL}/properties/addProperty`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const result = await response.json();
      if (response.ok) {
        alert("Success: Property Posted!");
        closeModal();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error posting property:", error);
      alert("An error occurred while posting the property.");
    }
  }
};
