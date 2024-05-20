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
  const user = useSelector((state) => state.user) || {};
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState({
    idPassport: user.idPassport || "",
    fullName: user.fullName || "",
    email: user.email || "",
  });

  const [incidentLocation, setIncidentLocation] = useState({
    governmentAgency: "",
    county: "",
    additionalInfo: "",
    latitude: "",
    longitude: "",
  });

  const [incidentData, setIncidentData] = useState({
    title: "",
    description: "",
    media: [],
  });

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setIncidentLocation({ ...incidentLocation, [name]: value });
  };

  const handleIncidentDataChange = (e) => {
    const { name, value } = e.target;
    setIncidentData({ ...incidentData, [name]: value });
  };

  const handleMediaUpload = (e) => {
    const newMedia = e.target.files;
    setIncidentData((prevData) => ({
      ...prevData,
      media: [...prevData.media, ...newMedia],
    }));
  };

  const handleMediaDrag = (result) => {
    if (!result.destination) return;

    const items = Array.from(incidentData.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIncidentData({ ...incidentData, media: items });
  };

  const handleMediaRemove = (indexToRemove) => {
    setIncidentData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    try {
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

      incidentData.media.forEach((media) => {
        reportForm.append("media", media);
      });

      const response = await fetch("http://localhost:3001/reports/create", {
        method: "POST",
        body: reportForm,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Report submission failed", err.message);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(incidentData.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIncidentData({ ...incidentData, media: items });
  };

  
  
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
                <option value="Agency1">Agency 1</option>
                <option value="Agency2">Agency 2</option>
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
      <Footer />
    </>
  );
};

export default CorruptionForm;
