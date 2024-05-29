// Importing necessary components, hooks, and libraries
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "../styles/CorruptionForm.css";
import "../styles/breakpoints.css";

const CorruptionForm = () => {

  // State to store user location
  // const [userLocation, setUserLocation] = useState(null);
  // State to store user-provided data

  // State to store location details of the incident
  const [incidentLocation, setIncidentLocation] = useState({
    governmentAgency: "",
    county: "",
    latitude: "",
    longitude: "",
  });

  // State to store incident details
  const [incidentData, setIncidentData] = useState({
    title: "",
    description: "",
    media: [],
  });

  // Handle changes in incident location inputs
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setIncidentLocation({ ...incidentLocation, [name]: value });
  };

  // Handle changes in incident data inputs
  const handleIncidentDataChange = (e) => {
    const { name, value } = e.target;
    setIncidentData({ ...incidentData, [name]: value });
  };

  // Handle media file uploads
  const handleMediaUpload = (e) => {
    const newMedia = e.target.files;
    setIncidentData((prevData) => ({
      ...prevData,
      media: [...prevData.media, ...newMedia],
    }));
  };

  // Handle removal of media files
  const handleMediaRemove = (indexToRemove) => {
    setIncidentData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Hook for navigation
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      console.log("Incident Location:", incidentLocation); // Log incident location

      // Collect the necessary data
      const data = {
        user_id: localStorage.getItem("user_id"),
        govt_agency: incidentLocation.governmentAgency || "Unknown Agency", // Provide a fallback value
        county: incidentLocation.county,
        title: incidentData.title,
        description: incidentData.description,
        latitude: incidentLocation.latitude || 0,
        longitude: incidentLocation.longitude || 0,
        media: [], // Placeholder for media URLs
      };

      // Upload each media file and collect the URLs
      const mediaUrls = await Promise.all(incidentData.media.map(async (media) => {
        const mediaForm = new FormData();
        mediaForm.append("file", media);

        const uploadResponse = await fetch("https://ireporter-api.onrender.com/upload_report", {
          method: "POST",
          body: mediaForm,
        });

        if (!uploadResponse.ok) {
          throw new Error("Media upload failed");
        }

        const uploadResult = await uploadResponse.json();
        return uploadResult.url;
      }));

      // Add media URLs to data object
      data.media = mediaUrls;

      // Send a POST request to create a new report
      const response = await fetch("https://ireporter-api.onrender.com/corruption_reports", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Show a success message to the user
        alert("Report submitted successfully!");
        // Navigate to the home page upon successful submission
        navigate("/user-dashboard");
      } else {
        const errorText = await response.text();
        alert(`Report submission failed: ${errorText}.\nPlease try again later.`);
      }
    } catch (err) {
      alert(`Report submission failed: ${err.message}.\nPlease try again later.`);
    }
  };

  // Function to get user's current location
  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setUserLocation({ latitude, longitude });
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // };

  return (
    <>
      <div className="create-report">
        <h1>Report an Corruption Incident</h1>
        <form onSubmit={handlePost}>
          {/* Step 1: User Data */}
          <div className="create-report_step1">
            <h2>Step 1: User Data</h2>
            <hr />
            <div className="user-data">
              <p>User ID</p>
              <input
                type="text"
                name="user_id"
                value={localStorage.getItem("user_id")}
                disabled={true}
              />
              <p>Full Name</p>
              <input
                type="text"
                name="fullName"
                value={localStorage.getItem("username")}
                disabled={true}
                required
              />
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={localStorage.getItem("email")}
                disabled={true}
                required
              />
            </div>
          </div>

          {/* Step 2: Location Data */}
          <div className="create-report_step2">
            <h2>Step 2: Location Data</h2>
            <hr />
            <div className="location-data">
              <p>Which govt. agency did the incident you wish to report occur in?</p>
              <select
                name="governmentAgency"
                onChange={handleLocationChange}
                required
              >
                {/* Replace with dynamic options */}
                <option value="">Select Agency</option>
                <option value="Ministry of Health">Ministry of Health</option>
                <option value="Kenya Ports Authority">Kenya Ports Authority</option>
                <option value="Judicial Service Commision">Judicial Service Commision</option>
                <option value="Kenya Wildlife Service">Kenya Wildlife Service</option>
                <option value="Kenya Bureau of Standards">Kenya Bureau of Standards</option>
                <option value="KEBS">KEBS</option>
                <option value="NHIF">NHIF</option>
              </select>
              <p>Which county did the incident occur in?</p>
              <input
                type="text"
                name="county"
                value={incidentLocation.county}
                onChange={handleLocationChange}
                required
              />
              <p>Latitude</p>
              <input
                type="text"
                name="latitude"
                value={incidentLocation.latitude}
                onChange={handleLocationChange}
                required
              />
              <p>Longitude</p>
              <input
                type="text"
                name="longitude"
                value={incidentLocation.longitude}
                onChange={handleLocationChange}
                required
              />
            </div>
          </div>

          {/* Step 3: Incident Data */}
          <div className="create-report_step3">
            <h2>Step 3: Incident Data</h2>
            <hr />
            <div className="incident-data">
              <p>Incident Title</p>
              <input
                type="text"
                name="title"
                value={incidentData.title}
                onChange={handleIncidentDataChange}
                required
              />
              <p>Give a brief description of the incident you wish to report</p>
              <textarea
                name="description"
                value={incidentData.description}
                onChange={handleIncidentDataChange}
                required
              />
              <p>Upload any media which could serve as evidence for the incident</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                required
              />
              <div className="media-previews">
                {incidentData.media.map((file, index) => (
                  <div className="media-item" key={index}>
                    {file.type.startsWith("image/") ? (
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                    ) : (
                      <video controls>
                        <source src={URL.createObjectURL(file)} type={file.type} />
                      </video>
                    )}
                    <button type="button" onClick={() => handleMediaRemove(index)}>
                      <BiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit">Submit Report</button>
        </form>
      </div>
    </>
  );
};

export default CorruptionForm;