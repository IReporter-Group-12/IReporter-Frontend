import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Slide from "../components/Slide";
import Modal from "../components/Modal";
import "../styles/Dashboard.css"


export default function UserDashboard() {

    const [corruptionReports, setCorruptionReports] = useState([])
    const [publicPetitions, setPublicPetitions] = useState([])

    const [corruptionForm, setCorruptionForm] = useState({
		governmentAgency: "",
		county: "",
		additionalInfo: "",
		latitude: "",
		longitude: "",
		title: "",
		description: "",
		media: [],
	});
    
    const [petitionForm, setPetitionForm] = useState({
        governmentAgency: "",
        county: "",
        additionalInfo: "",
        latitude: "",
        longitude: "",
        title: "",
        description: "",
        media: [],
    });


    // const user = useSelector((state) => state.user)
    const user_id = localStorage.getItem("user_id")
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username")
    const email = localStorage.getItem("email")

    const [showCorruptionModal, setShowCorruptionModal] = useState(false);
	const handleOpenCorruptionModal = () => setShowCorruptionModal(true);
	const handleCloseCorruptionModal = () => setShowCorruptionModal(false);
    const handleCorruptionClick = (id, status) => {
        if(status !== "Pending"){
            alert("Sorry, you cannot edit your report after it has been reviewed.")
        }else{
            localStorage.setItem("report_id", id)
            handleOpenCorruptionModal()
        }
    }

    const [showPetitionModal, setShowPetitionModal] = useState(false);
    const handleOpenPetitionModal = () => setShowPetitionModal(true);
    const handleClosePetitionModal = () => setShowPetitionModal(false);
    const handlePetitionClick = (id, status) => {
		if (status !== "Pending") {
			alert("Sorry, you cannot edit your report after it has been reviewed.");
		} else {
			localStorage.setItem("report_id", id);
			handleOpenPetitionModal();
		}
	};

    // const handleSubmit = e =>{
    //     e.preventDefault

    //     async () => {
    //         const res = await fetch()
    //     }
    // }


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
			{/* <Categories /> */}
            <h1>Welcome To Your Dashboard, {username}</h1>

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
					onSubmit={(e) => {
						e.preventDefault();
						alert("Form submitted!");
						handleCloseCorruptionModal();
					}}>
					<h2>Edit Corruption Report</h2>
                    <h4>You may add any updates to your report in this form</h4>

                    <label htmlFor="user_id">User ID:</label>
                    <input type="text" id="user_id" name="user_id" value={user_id}  disabled={true} /> <br />
                    
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} disabled={true} /> <br />
                    
                    <label htmlFor="governmentAgency">Government Agency:</label>
                    <input type="text" id="governmentAgency" name="governmentAgency"  /> <br />
                    
                    <label htmlFor="county">County:</label>
                    <input type="text" id="county" name="county"  /> <br />
                    
                    <label htmlFor="additionalInfo">Additional Info:</label>
                    <input type="text" id="additionalInfo" name="additionalInfo"  /> <br />
                    
                    <label htmlFor="latitude">Latitude:</label>
                    <input type="text" id="latitude" name="latitude"  /> <br />
                    
                    <label htmlFor="longitude">Longitude:</label>
                    <input type="text" id="longitude" name="longitude"  /> <br />
                    
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title"  /> <br />
                    
                    <label htmlFor="description">Description:</label>
                    <input type="textarea" id="description" name="description"  maxLength={200} /> <br />
                    
                    <label htmlFor="media">Media:</label>
                    <input type="file" id="media" name="media" multiple /> <br />
					<button type="submit">Submit</button>
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

                {/* public oetitions editing modal */}
				<Modal
					show={showPetitionModal}
					handleClose={handleClosePetitionModal}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							alert("Form submitted!");
							handleClosePetitionModal();
						}}>
						<h2>Edit Public Petition</h2>
                        <h4>You may add any updates to your report in this form</h4>

                        <label htmlFor="user_id">User ID:</label>
                        <input type="text" id="user_id" name="user_id" value={user_id} disabled={true} /> <br />
                        
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={username} disabled={true} /> <br />
                        
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={email} disabled={true} /> <br />
                        
                        <label htmlFor="governmentAgency">Government Agency:</label>
                        <input type="text" id="governmentAgency" name="governmentAgency"  /> <br />
                        
                        <label htmlFor="county">County:</label>
                        <input type="text" id="county" name="county"  /> <br />
                        
                        <label htmlFor="additionalInfo">Additional Info:</label>
                        <input type="text" id="additionalInfo" name="additionalInfo"  /> <br />
                        
                        <label htmlFor="latitude">Latitude:</label>
                        <input type="text" id="latitude" name="latitude"  /> <br />
                        
                        <label htmlFor="longitude">Longitude:</label>
                        <input type="text" id="longitude" name="longitude"  /> <br />
                        
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title"  /> <br />
                        
                        <label htmlFor="description">Description:</label>
                        <input type="text" id="description" name="description"  /> <br />
                        
                        <label htmlFor="media">Media:</label>
                        <input type="file" id="media" name="media" multiple /> <br />

                        <button type="submit">Submit</button>
					</form>
				</Modal>
			</div>
		</>
  );
}
