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
    idPassport: user.idPassport || "",
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
      // Create a FormData object to submit the form data
      const reportForm = new FormData();
      reportForm.append("idPassport", userData.idPassport);
      reportForm.append("fullName", userData.fullName);
      reportForm.append("email", userData.email);
      reportForm.append("governmentAgency", incidentLocation.governmentAgency);
      reportForm.append("county", incidentLocation.county);
      reportForm.append("additionalInfo", incidentLocation.additionalInfo);
      reportForm.append("latitude", incidentLocation.latitude);
      reportForm.append("longitude", incidentLocation.longitude);
      reportForm.append("title", incidentData.title);
      reportForm.append("description", incidentData.description);

      // Append media files to the form data
      incidentData.media.forEach((media) => {
        reportForm.append("media", media);
      });

      // Send the form data to the server
      const response = await fetch("https://ireporter-api.onrender.com/public_petitions", {
        method: "POST",
        body: reportForm,
      });

      // Navigate to the home page if the response is successful
      if (response.ok) {
        navigate("/");
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
            <hr />
            <div className="user-data">
              <p>ID/Passport No.</p>
              <input
                type="text"
                name="idPassport"
                value={userData.idPassport}
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
                <option value="Agency1">Agency 1</option>
                <option value="Agency2">Agency 2</option>
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
