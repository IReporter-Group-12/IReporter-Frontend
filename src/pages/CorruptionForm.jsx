// Importing necessary components, hooks, and libraries
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types } from "../data"; // Assuming categories and types for other purposes
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/CorruptionForm.css";
import "../styles/breakpoints.css";
import variables from "../styles/variables.css";

const CorruptionForm = () => {
  // Get user data from the Redux store or initialize as an empty object
  const user = useSelector((state) => state.user) || {};
  // State to store user location
  const [userLocation, setUserLocation] = useState(null);
  // State to store user-provided data
  const [userData, setUserData] = useState({
    user_id: user.user_id || "",
    fullName: user.fullName || "",
    email: user.email || "",
  });

  // State to store location details of the incident
  const [incidentLocation, setIncidentLocation] = useState({
    governmentAgency: "",
    county: "",
    additionalInfo: "",
    latitude: "",
    longitude: "",
  });

  // State to store incident details
  const [incidentData, setIncidentData] = useState({
    title: "",
    description: "",
    media: [],
  });

  // Handle changes in user data inputs
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
 
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

  // Handle drag and drop of media files
  const handleMediaDrag = (result) => {
    if (!result.destination) return;

    const items = Array.from(incidentData.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIncidentData({ ...incidentData, media: items });
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
      govt_agency: incidentLocation.govtAgency || "Unknown Agency", // Provide a fallback value
      county: incidentLocation.county,
      title: incidentData.title,
      description: incidentData.description,
      user_id: userData.user_id,
      latitude: incidentLocation.latitude || null,
      longitude: incidentLocation.longitude || null,
      media: [], // Placeholder for media URLs
    };

    console.log("Data to be sent:", data); // Log data to be sent

    // Upload each media file and collect the URLs
    const mediaUrls = await Promise.all(incidentData.media.map(async (media) => {
      const mediaForm = new FormData();
      mediaForm.append("file", media);

      const uploadResponse = await fetch("http://localhost:5000/upload_report", {
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

    console.log("Final data to be sent:", data); // Log final data to be sent

    // Send a POST request to create a new report
    const response = await fetch("http://localhost:5000/corruption_reports", {
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
      navigate("/");
    } else {
      const errorText = await response.text();
      console.log("Report submission failed", errorText);
    }
  } catch (err) {
    console.log("Report submission failed", err.message);
  }
};










  // Handle drag end event for media files
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(incidentData.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIncidentData({ ...incidentData, media: items });
  };

  // Function to get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-report">
        <h1>Report an Incident</h1>
        <form onSubmit={handlePost}>
          {/* Step 1: User Data */}
          <div className="create-report_step1">
            <h2>Step 1: User Data</h2>
            <hr />
            <div className="user-data">
              <p>ID/Passport No.</p>
              <input
                type="text"
                name="user_id"
                value={userData.user_id}
                onChange={handleUserDataChange}
                required
              />
              <p>Full Name</p>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleUserDataChange}
                required
              />
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
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
                value={incidentLocation.governmentAgency}
                onChange={handleLocationChange}
                required
              >
                {/* Replace with dynamic options */}
                <option value="">Select Agency</option>
                {/* Example agencies */}
                <option value="Agency1">KRA</option>
                <option value="Agency2">Immigration Department</option>
                <option value="Agency1">Kenya Police</option>
                <option value="Agency1">Registrar of Persons</option>
                <option value="Agency1">KWS</option>
                <option value="Agency1">County Health Services</option>
                <option value="Agency1">NHIF</option>
              </select>
              <p>Which county did the incident occur in?</p>
              <input
                type="text"
                name="county"
                value={incidentLocation.county}
                onChange={handleLocationChange}
                required
              />
              <p>Additional location info (optional)</p>
              <input
                type="text"
                name="additionalInfo"
                value={incidentLocation.additionalInfo}
                onChange={handleLocationChange}
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
                {/* Drag and Drop context for media files */}
                <DragDropContext onDragEnd={handleMediaDrag}>
                  <Droppable droppableId="media" direction="vertical">
                    {(provided) => (
                      <div
                        className="media"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {incidentData.media.map((file, index) => (
                          <Draggable
                            key={file.name}
                            draggableId={file.name}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="media-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {/* Display media preview */}
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                  />
                                ) : (
                                  <video controls>
                                    <source
                                      src={URL.createObjectURL(file)}
                                      type={file.type}
                                    />
                                  </video>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleMediaRemove(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>

          <button type="submit">Submit Report</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CorruptionForm;