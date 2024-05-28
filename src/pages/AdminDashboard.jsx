import React, { useState, useEffect } from "react";
import Slide from "../components/Slide";
import Modal from "../components/Modal";
import "../styles/Dashboard.css"


export default function AdminDashboard() {
    const [corruptionReports, setCorruptionReports] = useState([]);
    const [publicPetitions, setPublicPetitions] = useState([]);

    // Getting items in localstorage and assigning them to variables
    let current_report = 0
    const role = localStorage.getItem("role")

    const [corruptionForm, setCorruptionForm] = useState({
        status: null,
        admin_comments: null
    });

    const [petitionForm, setPetitionForm] = useState({
        status: null,
        admin_comments: null
    });

    // Managing modal visibility state
    const [showCorruptionModal, setShowCorruptionModal] = useState(false);
    const handleOpenCorruptionModal = () => setShowCorruptionModal(true);
    const handleCloseCorruptionModal = () => {
        setShowCorruptionModal(false);
        setCorruptionForm({
            status: null,
            admin_comments: null
        });
    };

    const [showPetitionModal, setShowPetitionModal] = useState(false);
    const handleOpenPetitionModal = () => setShowPetitionModal(true);
    const handleClosePetitionModal = () => {
        setShowPetitionModal(false);
        setPetitionForm({
            status: null,
            admin_comments: null
        });
    };

    const handleCorruptionChange = (e) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        setCorruptionForm((prevForm) => ({
            ...prevForm,
            [fieldName]: value
        }));
        console.log("CorruptionForm", corruptionForm);
    };

    const handlePetitionChange = (e) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        setPetitionForm((prevForm) => ({
            ...prevForm,
            [fieldName]: value
        }));
        console.log("PetitionForm", petitionForm);
    };

    const handleCorruptionClick = (id) => {
        current_report = id
        handleOpenCorruptionModal();
    };

    const handlePetitionClick = (id) => {
        current_report = id
        handleOpenPetitionModal();
    };

    const handleCorruptionSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://ireporter-api.onrender.com/admin_corruption_reports/${current_report}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(corruptionForm)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Successfully updated report!");
                handleCloseCorruptionModal();
                window.location.reload();
            } else {
                alert(`Failed to update report: ${data.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    };

    const handlePetitionSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://ireporter-api.onrender.com/admin_public_petitions/${current_report}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(petitionForm)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Successfully updated report!");
                handleClosePetitionModal();
                window.location.reload();
            } else {
                alert(`Failed to update report: ${data.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    };

    useEffect(
        () => async function () {
            if (role === 'admin') {
                try {
                    const res = await fetch("https://ireporter-api.onrender.com/corruption_reports", {
                        method: "GET"
                    });
                    const data = await res.json();
                    setCorruptionReports(data);
                } catch (err) {
                    console.error(`Error: ${err.message}`);
                }
            }
        }, [role]);

    useEffect(
        () => async function () {
            if(role === 'admin') {
                try {
                    const res = await fetch("https://ireporter-api.onrender.com/public_petitions", {
                        method: "GET"
                    });
                    const data = await res.json();
                    setPublicPetitions(data);
                } catch (err) {
                    console.error(`Error: ${err.message}`);
                }
            }
        }, [role]);

    return (
        <>
            <Slide />

            <h1 className="welcome-message">Welcome To The Admin Dashboard!</h1>

            <h2 className="section-header">All Corruption Reports</h2>

            {corruptionReports.length !== 0 ? 
                <div className="card-container">
                    {corruptionReports.map((report, index) => (
                        <div className="card" key={index}>
                            <img src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp" alt="Corruption Image" className="card-image" />
                            <div className="card-content">
                                <small className={`${report.status === 'Pending' ? 'status-pending' :
                                        report.status === 'Resolved' ? 'status-resolved' :
                                            report.status === 'Rejected' ? 'status-rejected' : 'report-status'
                                    }`}> {report.status} </small>
                                <h3 className="card-title">{report.title}</h3>
                                <h4 className="card-location">{report.govt_agency}, {report.county}</h4>
                                <p className="card-id">ID: {report.id}</p>
                                <p className="card-description">{report.description}</p>
                                {report.admin_comments ?
                                    <p className="card-description"><b>Admin Comments:</b> {report.admin_comments}</p>
                                    : null
                                }

                                <button
                                    onClick={() => handleCorruptionClick(report.id)}
                                    className="card-button">
                                    Review Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            : <div className="card-container"><p>All added Corruption Reports will show up here.</p></div>
            }


            {/* Corruption Reports editing modal */}
            <Modal show={showCorruptionModal} handleClose={handleCloseCorruptionModal}>
                <form name="edit-corruption" onSubmit={handleCorruptionSubmit}>
                    <h2>Review Corruption Report</h2>
                    <h3>You may change the status and add additional comments.</h3>

                    <div>
                        <h4><b>Change Report Status:</b></h4>
                        <input
                            type="radio"
                            id="underReview"
                            name="status"
                            value="Under Review"
                            checked={corruptionForm.status === "Under Review"}
                            onChange={handleCorruptionChange}
                        />
                        <label htmlFor="underReview">Under Review</label> <br />
                        <input
                            type="radio"
                            id="resolved"
                            name="status"
                            value="Resolved"
                            checked={corruptionForm.status === "Resolved"}
                            onChange={handleCorruptionChange}
                        />
                        <label htmlFor="resolved">Resolved</label> <br />
                        <input
                            type="radio"
                            id="rejected"
                            name="status"
                            value="Rejected"
                            checked={corruptionForm.status === "Rejected"}
                            onChange={handleCorruptionChange}
                        />
                        <label htmlFor="rejected">Rejected</label>
                    </div>

                    <label htmlFor="admin_comments"><b>Admin Comments:</b></label>
                    <textarea
                        id="admin_comments"
                        name="admin_comments"
                        value={corruptionForm.admin_comments}
                        onChange={handleCorruptionChange}
                        maxLength={200}
                        rows={4}
                        cols={30}
                    />
                    <br />

                    <button type="submit" className="modal-button">Submit</button>
                </form>
            </Modal>

            <h2 className="section-header">All Public Petitions</h2>

            {publicPetitions.length !== 0 ?
                <div className="card-container">
                    {publicPetitions.map((report, index) => (
                        <div className="card" key={index}>
                            <img src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp" alt="Corruption Image" className="card-image" />
                            <div className="card-content">
                                <small className={`${report.status === 'Pending' ? 'status-pending' :
                                        report.status === 'Resolved' ? 'status-resolved' :
                                            report.status === 'Rejected' ? 'status-rejected' : 'report-status'
                                    }`}> {report.status} </small>
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
                                    onClick={() => handlePetitionClick(report.id)}
                                    className="card-button">
                                    Review Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            : <div className="card-container"><p>All added Public Petitions will show up here.</p></div>
            }


            {/* Petition Reports editing modal */}
            <Modal show={showPetitionModal} handleClose={handleClosePetitionModal}>
                <form name="edit-petition" onSubmit={handlePetitionSubmit}>
                    <h2>Review Petition Report</h2>
                    <h4>You may change the status and add additional comments.</h4>

                    <div>
                        <h5>Change Report Status:</h5>
                        <input
                            type="radio"
                            id="underReviewPetition"
                            name="status"
                            value="Under Review"
                            checked={petitionForm.status === "Under Review"}
                            onChange={handlePetitionChange}
                        />
                        <label htmlFor="underReviewPetition">Under Review</label> <br />
                        <input
                            type="radio"
                            id="resolvedPetition"
                            name="status"
                            value="Resolved"
                            checked={petitionForm.status === "Resolved"}
                            onChange={handlePetitionChange}
                        />
                        <label htmlFor="resolvedPetition">Resolved</label> <br />
                        <input
                            type="radio"
                            id="rejectedPetition"
                            name="status"
                            value="Rejected"
                            checked={petitionForm.status === "Rejected"}
                            onChange={handlePetitionChange}
                        />
                        <label htmlFor="rejectedPetition">Rejected</label>
                    </div>

                    <label htmlFor="admin_comments_petition">Admin Comments:</label>
                    <textarea
                        id="admin_comments_petition"
                        name="admin_comments"
                        value={petitionForm.admin_comments}
                        onChange={handlePetitionChange}
                        maxLength={200}
                        rows={4}
                        cols={30}
                    />
                    <br />

                    <button type="submit" className="modal-button">Submit</button>
                </form>
            </Modal>
        </>
    );
}