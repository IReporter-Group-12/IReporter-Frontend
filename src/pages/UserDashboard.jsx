import React, { useState, useEffect } from "react";
import Slide from "../components/Slide";
import Modal from "../components/Modal";
import "../styles/Dashboard.css"


export default function UserDashboard() {

    // getting items in localstorage and assigning them to variables
    const loggedIn= localStorage.getItem("logged_in")
    const user_id = localStorage.getItem("user_id")
    const username = localStorage.getItem("username")
    const email = localStorage.getItem("email")
    const current_report = localStorage.getItem("report_id")

    const [corruptionReports, setCorruptionReports] = useState([])
    const [publicPetitions, setPublicPetitions] = useState([])

    const [corruptionForm, setCorruptionForm] = useState({
        "title" : '',
		"govt_agency": '',
		"county": '',
		"latitude": '',
		"longitude": '',
		"description": '',
		"media": [],
	});
    const [petitionForm, setPetitionForm] = useState({
        "title": '',
        "govt_agency": '',
        "county": '',
        "latitude": '',
        "longitude": '',
        "description": '',
        "media": [],
    });

    const [showCorruptionModal, setShowCorruptionModal] = useState(false);

	const handleOpenCorruptionModal = () => setShowCorruptionModal(true);

	const handleCloseCorruptionModal = () => {
        setShowCorruptionModal(false);
        setCorruptionForm({
            "title": '',
            "govt_agency": '',
            "county": '',
            "latitude": '',
            "longitude": '',
            "description": '',
            "media": [],
        })
    }

    const [showPetitionModal, setShowPetitionModal] = useState(false);

    const handleOpenPetitionModal = () => setShowPetitionModal(true);

    const handleClosePetitionModal = () => {
        setShowPetitionModal(false);
        setPetitionForm({
            "title": '',
            "govt_agency": '',
            "county": '',
            "latitude": '',
            "longitude": '',
            "description": '',
            "media": [],
        })
    }


    const handleCorruptionClick = (id, status, index) => {
        if (status !== "Pending") {
            alert("Sorry, you cannot edit your report after it has been reviewed.")
        } else {
            localStorage.setItem("report_id", id)
            const report = corruptionReports[index];
            setCorruptionForm({
                title: report.title,
                govt_agency: report.govt_agency,
                county: report.county,
                latitude: report.latitude,
                longitude: report.longitude,
                description: report.description,
                media: report.media || [],
            });
            handleOpenCorruptionModal()
        }
    }
    const handlePetitionClick = (id, status, index) => {
		if (status !== "Pending") {
			alert("Sorry, you cannot edit your report after it has been reviewed.");
		} else {
			localStorage.setItem("report_id", id);
            const petition = publicPetitions[index];
            setPetitionForm({
                title: petition.title,
                govt_agency: petition.govt_agency,
                county: petition.county,
                latitude: petition.latitude,
                longitude: petition.longitude,
                description: petition.description,
                media: petition.media || [],
            });
			handleOpenPetitionModal();
		}
	};


    const handleCorruptionChange = (e) => {
        // Setting the variables to the field form attributes
        const fieldName = e.target.name
        const value = e.target.value

        // function to set the formData state to the value of the forms
        setCorruptionForm({
            ...corruptionForm,
            [fieldName]: value
        })
        // console.log("Updating Corruption Form", corruptionForm)
    }
    const handlePetitionChange = (e) => {
        // Setting the variables to the field form attributes
        const fieldName = e.target.name
        const value = e.target.value

        // function to set the formData state to the value of the forms
        setPetitionForm({
            ...petitionForm,
            [fieldName]: value
        })
        // console.log("Updating Petition Form", petitionForm)
    }


    const handleCorruptionSubmit = async (e) => {

        e.preventDefault();
        console.log("Final Corruption Form", corruptionForm)
        
        try {
            const res = await fetch(`http://127.0.0.1:5000/corruption_reports/${current_report}`, {
                method : "PATCH",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(corruptionForm)
            })

            const data = await res.json()
            
            if (res.ok){
                alert("Successfully updated report!");
                // const updatedReports = corruptionReports.map((report) =>
                //     report.id === current_report ? { ...report, ...corruptionForm } : report
                // );
                // setCorruptionReports(updatedReports);


                handleCloseCorruptionModal();
                window.location.reload()
            } else{
                alert(`Failed to update report: ${data.error || "Unknown error"}`)
            }
        }
        catch (err) {
            console.error(`Error: ${err.message}`);
        }
    };
    const handlePetitionSubmit = async (e) => {

        e.preventDefault();
        console.log("Final Petition Form", petitionForm)
        
        try {
            const res = await fetch(`http://127.0.0.1:5000/public_petitions/${current_report}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(petitionForm)
            })

            const data = await res.json()

            if (res.ok) {
                alert("Successfully updated petition!");
                // const updatedPetitions = publicPetitions.map((petition) =>
                //     petition.id === current_report ? { ...petition, ...petitionForm } : petition
                // );
                // setPublicPetitions(updatedPetitions)

                handleCloseCorruptionModal();
                window.location.reload()
            } else {
                alert(`Failed to update report: ${data.error || "Unknown error"}`)
            }
        }
        catch (err) {
            console.error(`Error: ${err.message}`);
        }
    }


    useEffect(
		() => async function () {
            if(loggedIn === "true"){
				try {
					const res = await fetch(`http://127.0.0.1:5000/corruption_reports/${user_id}/`,
						{method: "GET"}
					);
					const data = await res.json();
					// console.log('Corruption Reports: ', data);
					setCorruptionReports(data);
				} catch (err) {console.error(`Error: ${err.message}`);}
            }
		},
		[loggedIn, user_id]
	);
    useEffect(
        () => async function () {
            if(loggedIn === "true"){
                try {
                    const res = await fetch(`http://127.0.0.1:5000/public_petitions/${user_id}/`,
                        {method: "GET"}
                    );
                    const data = await res.json();
                    // console.log('Public Petitions: ', data);
                    setPublicPetitions(data);
                } catch (err) {
                    console.error(`Error: ${err.message}`);
                }
            }
        },
        [loggedIn, user_id]
    );

    
  return (
		<>
			<Slide />
			{/* <Categories /> */}
            <h1 className="welcome-message">Welcome To Your Dashboard, {username}</h1>

			<h2 className="section-header">Your Corruption Reports</h2>
            {corruptionReports.length !== 0? 
                <div className="card-container">
                    {corruptionReports.map((report, index) => (
                        <div className="card" key={index}>
                            <img
                                src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp"
                                alt="Corruption Image"
                                className="card-image"
                            />
                            <div className="card-content">
                                <small
                                    className={`${
                                        report.status === "Pending"
                                            ? "status-pending"
                                            : report.status === "Resolved"
                                            ? "status-resolved"
                                            : report.status === "Rejected"
                                            ? "status-rejected"
                                            : "report-status"
                                    }`}>
                                    {" "}
                                    {report.status}{" "}
                                </small>
                                <h3 className="card-title">Title: {report.title}</h3>
                                <h4 className="card-location">
                                    <b>Occurred At:</b> {report.govt_agency}, {report.county}
                                </h4>
                                <p className="card-id">ID: {report.id}</p>
                                <p className="card-description"><b>Description:</b> {report.description}</p>
                                {report.admin_comments ?
                                    <p className="card-description"><b>Admin Comments:</b> {report.admin_comments}</p>
                                : null
                                }
                                <button
                                    onClick={()=>handleCorruptionClick(report.id, report.status, index)}
                                    className="card-button">
                                    Edit Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              : <div className="card-container"><p>Corruption Reports you add will show up here.</p></div>
              }

            {/* Corruption Reports editing modal */}
			<Modal
				show={showCorruptionModal}
				handleClose={handleCloseCorruptionModal}>
				<form
                    name="edit-corruption"
					onSubmit={(e) => handleCorruptionSubmit(e)}>
					<h2>Edit Corruption Report</h2>
                    <h3>You may add any updates to your report in this form</h3>

                    <label htmlFor="user_id">User ID:</label>
                    <input type="text" id="user_id" name="user_id" value={user_id}  disabled={true} /> <br />
                    
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} disabled={true} /> <br />

                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={corruptionForm.title || ""} disabled={true} /> <br />

                    
                    <label htmlFor="govt_agency">Government Agency:</label>
                    <select id="govt_agency" name="govt_agency" onChange={handleCorruptionChange} value={corruptionForm.govt_agency || ""}>
                        <option >Select Agency</option>
                        <option value="Ministry of Health">Ministry of Health</option>
                        <option value="Kenya Ports Authority">Kenya Ports Authority</option>
                        <option value="Judicial Service Commision">Judicial Service Commision</option>
                        <option value="Kenya Wildlife Service">Kenya Wildlife Service</option>
                        <option value="Kenya Bureau of Standards">Kenya Bureau of Standards</option>
                        <option value="KEBS">KEBS</option>
                        <option value="NHIF">NHIF</option>
                    </select>
                    
                    <label htmlFor="county">County:</label>
                    <input type="text" id="county" name="county" value={corruptionForm.county || ""} onChange={handleCorruptionChange} /> <br />
                                        
                    <label htmlFor="latitude">Latitude:</label>
                    <input type="text" id="latitude" name="latitude" value={corruptionForm.latitude || ""} onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="longitude">Longitude:</label>
                    <input type="text" id="longitude" name="longitude" value={corruptionForm.longitude || ""} onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="description">Description:</label>
                    <textarea type="textarea" id="description" name="description" form="edit-corruption" maxLength={200} rows={4} cols={30} value={corruptionForm.description || ""} onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="media">Media:</label>
                    <input type="file" id="media" name="media" accept="image/*,video/*" multiple /> <br />

					<button type="submit" className="modal-button" >Submit</button>
				</form>
			</Modal>


			<h2 className="section-header">Your Public Petitions</h2>
            {publicPetitions.length !== 0 ?
                <div className="card-container">
                    {publicPetitions.map((report, index) => (
                        <div className="card" key={index}>
                            <img
                                src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp"
                                alt="Corruption Image"
                                className="card-image"
                            />
                            <div className="card-content">
                                <small
                                    className={`${
                                        report.status === "Pending"
                                            ? "status-pending"
                                            : report.status === "Resolved"
                                            ? "status-resolved"
                                            : report.status === "Rejected"
                                            ? "status-rejected"
                                            : "report-status"
                                    }`}>
                                    {" "}
                                    {report.status}{" "}
                                </small>
                                <h3 className="card-title">Title: {report.title}</h3>
                                <h4 className="card-location">
                                    <b>Occurred At:</b> {report.govt_agency}, {report.county}
                                </h4>
                                <p className="card-id">ID: {report.id}</p>
                                <p className="card-description"><b>Description:</b> {report.description}</p>
                                {report.admin_comments ?
                                    <p className="card-description"><b>Admin Comments:</b> {report.admin_comments}</p>
                                    : null
                                }
                                <button
                                    onClick={() => handlePetitionClick(report.id, report.status, index)}
                                    className="card-button">
                                    Edit Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              : <div className="card-container"><p>Public Petitions you add will show up here.</p></div>
            }

            {/* public petitions editing modal */}
            <Modal
                show={showPetitionModal}
                handleClose={handleClosePetitionModal}>
                <form
                    name="edit-petition"
                    onSubmit={(e) => handlePetitionSubmit(e)}>
                    <h2>Edit Public Petition</h2>
                    <h3>You may add any updates to your report in this form</h3>

                    <label htmlFor="user_id">User ID:</label>
                    <input type="text" id="user_id" name="user_id" value={user_id} disabled={true} /> <br />
                    
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} disabled={true} /> <br />
                    
                    <label htmlFor="title">Title:</label>
                  <input type="text" id="title" name="title" value={petitionForm.title || ""} disabled={true} /> <br />

                    <label htmlFor="govt_agency">Government Agency:</label>
                  <select id="govt_agency" name="govt_agency" onChange={handlePetitionChange} value={petitionForm.govt_agency || ""}>
                        <option >Select Agency</option>
                        <option value="Ministry of Health">Ministry of Health</option>
                        <option value="Kenya Ports Authority">Kenya Ports Authority</option>
                        <option value="Judicial Service Commision">Judicial Service Commision</option>
                        <option value="Kenya Wildlife Service">Kenya Wildlife Service</option>
                        <option value="Kenya Bureau of Standards">Kenya Bureau of Standards</option>
                        <option value="KEBS">KEBS</option>
                        <option value="NHIF">NHIF</option>
                    </select>
                    
                    <label htmlFor="county">County:</label>
                  <input type="text" id="county" name="county" onChange={handlePetitionChange} value={petitionForm.county || ""} /> <br />
                                            
                    <label htmlFor="latitude">Latitude:</label>
                  <input type="text" id="latitude" name="latitude" onChange={handlePetitionChange} value={petitionForm.latitude || ""} /> <br />
                    
                    <label htmlFor="longitude">Longitude:</label>
                  <input type="text" id="longitude" name="longitude" onChange={handlePetitionChange} value={petitionForm.longitude || ""} /> <br />
                            
                    <label htmlFor="description">Description:</label>
                  <textarea type="text" id="description" name="description" form="edit-petition" onChange={handlePetitionChange} maxLength={200} rows={4} cols={30} value={petitionForm.description || ""} /> <br />
                    
                    <label htmlFor="media">Media:</label>
                    <input type="file" id="media" name="media" accept="image/*,video/*" multiple /> <br />

                    <button type="submit" className="modal-button">Submit</button>
                </form>
            </Modal>
		</>
    );
}
