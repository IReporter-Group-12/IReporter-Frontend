import React, { useState, useEffect } from "react";
import Slide from "../components/Slide";
import Modal from "../components/Modal";
import Categories from "../components/Categories";
import "../styles/Dashboard.css"


export default function UserDashboard() {

    // getting items in localstorage and assigning them to variables
    const user_id = localStorage.getItem("user_id")
    const username = localStorage.getItem("username")
    const email = localStorage.getItem("email")
    const current_report = localStorage.getItem("report_id")

    const [corruptionReports, setCorruptionReports] = useState([])
    const [publicPetitions, setPublicPetitions] = useState([])

    const [corruptionForm, setCorruptionForm] = useState({
		"govt_agency": "",
		"county": "",
		"latitude": 0,
		"longitude": 0,
		"description": "",
		"media": [],
	});
    const [petitionForm, setPetitionForm] = useState({
        "govt_agency": "",
        "county": "",
        "latitude": 0,
        "longitude": 0,
        "description": "",
        "media": [],
    });


    const [showCorruptionModal, setShowCorruptionModal] = useState(false);
	const handleOpenCorruptionModal = () => setShowCorruptionModal(true);
	const handleCloseCorruptionModal = () => {
        setShowCorruptionModal(false);
        setCorruptionForm({
            "govt_agency": "",
            "county": "",
            "latitude": 0,
            "longitude": 0,
            "description": "",
            "media": [],
        })
    }
    const [showPetitionModal, setShowPetitionModal] = useState(false);
    const handleOpenPetitionModal = () => setShowPetitionModal(true);
    const handleClosePetitionModal = () => {
        setShowPetitionModal(false);
        setPetitionForm({
            "govt_agency": "",
            "county": "",
            "latitude": 0,
            "longitude": 0,
            "description": "",
            "media": [],
        })
    }


    const handleCorruptionClick = (id, status) => {
        if (status !== "Pending") {
            alert("Sorry, you cannot edit your report after it has been reviewed.")
        } else {
            localStorage.setItem("report_id", id)
            handleOpenCorruptionModal()
        }
    }
    const handlePetitionClick = (id, status) => {
		if (status !== "Pending") {
			alert("Sorry, you cannot edit your report after it has been reviewed.");
		} else {
			localStorage.setItem("report_id", id);
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
        // console.log(corruptionForm)
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
        // console.log(petitionForm)
    }


    const handleCorruptionSubmit = async (e) => {

        e.preventDefault();
        // console.log(corruptionForm)
        
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
        // console.log(petitionForm)
        
        try {
            const res = await fetch(`http://127.0.0.1:5000/public_petitions/${current_report}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(corruptionForm)
            })

            const data = await res.json()

            if (res.ok) {
                alert("Successfully updated report!");
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
				try {
					const res = await fetch(`http://127.0.0.1:5000/corruption_reports/${user_id}/`,
						{method: "GET"}
					);
					const data = await res.json();
					console.log('Corruption Reports: ', data);
					setCorruptionReports(data);
				} catch (err) {console.error(`Error: ${err.message}`);}
			},
		[user_id]
	);
    useEffect(
        () => async function () {
                try {
                    const res = await fetch(`http://127.0.0.1:5000/public_petitions/${user_id}/`,
                        {method: "GET"}
                    );
                    const data = await res.json();
                    console.log('Public Petitions: ', data);
                    setPublicPetitions(data);
                } catch (err) {
                    console.error(`Error: ${err.message}`);
                }
            },
        [user_id]
    );

    
  return (
		<>
			<Slide />
			<Categories />
            <h1 className="welcome-message">Welcome To Your Dashboard, {username}</h1>

			<h2 className="section-header">Your Corruption Reports</h2>
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
							<h3 className="card-title">{report.title}</h3>
							<h4 className="card-location">
								{report.govt_agency}, {report.county}
							</h4>
							<p className="card-id">ID: {report.id}</p>
							<p className="card-description">
								{report.description}
							</p>
							<button
								onClick={()=>handleCorruptionClick(report.id, report.status)}
								className="card-button">
								Edit Report
							</button>
						</div>
					</div>
				))}
			</div>

            {/* Corruption Reports editing modal */}
			<Modal
				show={showCorruptionModal}
				handleClose={handleCloseCorruptionModal}>
				<form
                    name="edit-corruption"
					onSubmit={(e) => handleCorruptionSubmit(e)}>
					<h2>Edit Corruption Report</h2>
                    <h4>You may add any updates to your report in this form</h4>

                    <label htmlFor="user_id">User ID:</label>
                    <input type="text" id="user_id" name="user_id" value={user_id}  disabled={true} /> <br />
                    
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} disabled={true} /> <br />
                    
                    <label htmlFor="govt_agency">Government Agency:</label>
                    <input type="text" id="govt_aency"  name="govt_agency" onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="county">County:</label>
                    <input type="text" id="county" name="county" onChange={handleCorruptionChange} /> <br />
                                        
                    <label htmlFor="latitude">Latitude:</label>
                    <input type="text" id="latitude" name="latitude" onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="longitude">Longitude:</label>
                    <input type="text" id="longitude" name="longitude" onChange={handleCorruptionChange} /> <br />
                    
                    <label htmlFor="description">Description:</label>
                    <textarea type="textarea" id="description" name="description" form="edit-corruption" onChange={handleCorruptionChange} maxLength={200} rows={4} cols={30} /> <br />
                    
                    <label htmlFor="media">Media:</label>
                    <input type="file" id="media" name="media" multiple /> <br />
					<button type="submit" >Submit</button>
				</form>
			</Modal>

			<h2 className="section-header">Your Public Petitions</h2>
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
							<h3 className="card-title">{report.title}</h3>
							<h4 className="card-location">
								{report.govt_agency}, {report.county}
							</h4>
							<p className="card-id">ID: {report.id}</p>
							<p className="card-description">
								{report.description}
							</p>
							<button
								onClick={() => handlePetitionClick(report.id, report.status)}
								className="card-button">
								Edit Report
							</button>
						</div>
					</div>
				))}

                {/* public petitions editing modal */}
				<Modal
					show={showPetitionModal}
					handleClose={handleClosePetitionModal}>
					<form
                        name="edit-petition"
						onSubmit={(e) => handlePetitionSubmit(e)}>
						<h2>Edit Public Petition</h2>
                        <h4>You may add any updates to your report in this form</h4>

                        <label htmlFor="user_id">User ID:</label>
                        <input type="text" id="user_id" name="user_id" value={user_id} disabled={true} /> <br />
                        
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                        
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={email} disabled={true} /> <br />
                        
                        <label htmlFor="govt_agency">Government Agency:</label>
                        <input type="text" id="govt_agency" name="govt_agency"  onChange={handlePetitionChange} /> <br />
                        
                        <label htmlFor="county">County:</label>
                        <input type="text" id="county" name="county" onChange={handlePetitionChange} /> <br />
                                                
                        <label htmlFor="latitude">Latitude:</label>
                        <input type="text" id="latitude" name="latitude" onChange={handlePetitionChange} /> <br />
                        
                        <label htmlFor="longitude">Longitude:</label>
                        <input type="text" id="longitude" name="longitude" onChange={handlePetitionChange} /> <br />
                                
                        <label htmlFor="description">Description:</label>
                        <textarea type="text" id="description" name="description" form="edit-petition" onChange={handlePetitionChange} maxLength={200} rows={4} cols={30} /> <br />
                        
                        <label htmlFor="media">Media:</label>
                        <input type="file" id="media" name="media" multiple /> <br />

                        <button type="submit">Submit</button>
					</form>
				</Modal>
			</div>
		</>
  );
}
