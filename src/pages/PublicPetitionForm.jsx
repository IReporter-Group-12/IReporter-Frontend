// Import necessary components and dependencies
import Footer from "../components/Footer"; // Footer component
import { categories, types } from "../data"; // Import categories and types data
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"; // For drag-and-drop functionality
import { useState } from "react"; // useState hook from React
import { BiTrash } from "react-icons/bi"; // Trash icon from react-icons
import { useSelector } from "react-redux"; // useSelector hook from Redux
import { useNavigate } from "react-router-dom"; // useNavigate from react-router-dom for navigation
import "../styles/PublicPetition.css"; // CSS for styling the form
import "../styles/breakpoints.css"; // CSS for responsive design
import variables from "../styles/variables.css"; // CSS variables

// Define the PublicPetitionForm component
const PublicPetitionForm = () => {
  // Get user data from the Redux store
  const user = useSelector((state) => state.user) || {};
  
  // State to store user's location
  const [userLocation, setUserLocation] = useState(null);

  // State to store user data
  const [userData, setUserData] = useState({
    user_id: user.user_id || "",
    fullName: user.fullName || "",
    email: user.email || "",
  });

  // State to store incident location data
  const [incidentLocation, setIncidentLocation] = useState({
    governmentAgency: "",
    county: "",
    additionalInfo: "",
    latitude: "",
    longitude: "",
  });

  // State to store incident data
  const [incidentData, setIncidentData] = useState({
    title: "",
    description: "",
    media: [],
  });

  // Handle changes to user data inputs
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle changes to incident location inputs
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setIncidentLocation({ ...incidentLocation, [name]: value });
  };

  // Handle changes to incident data inputs
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

  // Handle reordering of media items via drag-and-drop
  const handleMediaDrag = (result) => {
    if (!result.destination) return;

    const items = Array.from(incidentData.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIncidentData({ ...incidentData, media: items });
  };

  // Handle removal of media items
  const handleMediaRemove = (indexToRemove) => {
    setIncidentData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handlePost = async (e) => {
    e.preventDefault();
  
    try {
      // Collect the necessary data
      const data = {
        user_id: userData.user_id,
        fullName: userData.fullName,
        email: userData.email,
        govt_agency: incidentLocation.govtAgency || "Unknown Agency", // Provide a fallback value
        county: incidentLocation.county,
        additionalInfo: incidentLocation.additionalInfo,
        latitude: incidentLocation.latitude || null,
        longitude: incidentLocation.longitude || null,
        title: incidentData.title,
        description: incidentData.description,
        media: [], // Placeholder for media URLs
      };
  
      console.log("Data to be sent:", data); // Log data to be sent
  
      // Upload each media file and collect the URLs
      const mediaUrls = await Promise.all(incidentData.media.map(async (media) => {
        const mediaForm = new FormData();
        mediaForm.append("file", media);
  
        const uploadResponse = await fetch("http://127.0.0.1:5000/upload_resolution", {
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
      const response = await fetch("http://127.0.0.1:5000/public_petitions", {
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
  
  // Function to get the user's current location
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

  // Render the form
  return (
    <>
      <div className="create-report">
        <h1>Intervention Report</h1>
        <form onSubmit={handlePost}>
          <div className="create-report_step1">
            <h2>Step 1: User Data</h2>
            <hr/>
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

          <div className="create-report_step2">
            <h2>Step 2: Location Data</h2>
            <hr />
            <div className="location-data">
              <p>Which government agency does the petition you wish to submit pertain to?</p>
              <select
                name="governmentAgency"
                value={incidentLocation.governmentAgency}
                onChange={handleLocationChange}
                required
              >
                {/* Replace with dynamic options */}
                <option value="">Select Agency</option>
                {/* Example agencies */}
                <option value="Agency1">Ministry of Health</option>
                <option value="Agency2">Kenya Ports Authority</option>
                <option value="Agency2">Judicial Service Commision</option>
                <option value="Agency2">Kenya Wildlife Service</option>
                <option value="Agency2">Kenya Bureau of Standards</option>
                <option value="Agency2">KEBS</option>
              </select>
              <p>Which county does the petition you wish to submit pertain to?</p>
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

          <div className="create-report_step3">
            <h2>Step 3: Incident Data</h2>
            <hr />
            <div className="incident-data">
              <p>Petition Title</p>
              <input
                type="text"
                name="title"
                value={incidentData.title}
                onChange={handleIncidentDataChange}
                required
              />
              <p>Give a brief description of the petition you wish to submit</p>
              <textarea
                name="description"
                value={incidentData.description}
                onChange={handleIncidentDataChange}
                required
              />
              <p>Upload any media which could serve as evidence for the petition</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                required
              />
              <div className="media-previews">
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
      <Footer /> {/* Footer component */}
    </>
  );
};

export default PublicPetitionForm;
