import React, { useState, useEffect } from "react";
import Slide from "../components/Slide";
import "../styles/Dashboard.css"


export default function UserDashboard() {

    const [corruptionReports, setCorruptionReports] = useState([])
    const [publicPetitions, setPublicPetitions] = useState([])

    useEffect(
		() =>
			async function () {
				try {
					const res = await fetch(
						"http://127.0.0.1:5000/corruption_reports",
						{
							method: "GET",
						}
					);
					const data = await res.json();
					console.log('Corruption Reports: ', data);
					setCorruptionReports(data);
				} catch (err) {
					console.error(`Error: ${err.message}`);
				}
			},
		[]
	);

        useEffect(
			() =>
				async function () {
					try {
						const res = await fetch(
							"http://127.0.0.1:5000/public_petitions",
							{
								method: "GET",
							}
						);
						const data = await res.json();
						console.log('Public Petitions: ', data);
						setPublicPetitions(data);
					} catch (err) {
						console.error(`Error: ${err.message}`);
					}
				},
			[]
		);

  return (
    <>
        <Slide />

        <h2 className="section-header">All Corruption Reports</h2>
        <div className="card-container">
            {corruptionReports.map((report, index) => (
                <div className="card" key={index}>
                    <img src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp" alt="Corruption Image" className="card-image" />
                    <div className="card-content">
                        <small className={`${
                            report.status === 'Pending' ? 'status-pending' : 
                            report.status === 'Resolved' ? 'status-resolved' :
                            report.status ==='Rejected' ?'status-rejected' : 'report-status'
                        }`}> {report.status} </small>
                        <h3 className="card-title">{report.title}</h3>
                        <h4 className="card-location">{report.govt_agency}, {report.county}</h4>
                        <p className="card-id">ID: {report.id}</p>
                        <p className="card-description">{report.description}</p>
                        <button className="card-button">Review Report</button>
                    </div>
                </div>
            ))}
        </div>

        <h2 className="section-header">All Public Petitions</h2>
        <div className="card-container">
            {publicPetitions.map((report, index) => (
                <div className="card" key={index}>
                    <img src="https://www.mediastorehouse.com.au/p/251/nairobi-city-skyline-kenyas-parliament-1643509.jpg.webp" alt="Corruption Image" className="card-image" />
                    <div className="card-content">
                        <small className={`${
                            report.status === 'Pending' ? 'status-pending' : 
                            report.status === 'Resolved' ? 'status-resolved' :
                            report.status ==='Rejected' ?'status-rejected' : 'report-status'
                        }`}> {report.status} </small>
                        <h3 className="card-title">{report.title}</h3>
                        <h4 className="card-location">{report.govt_agency}, {report.county}</h4>
                        <p className="card-id">ID: {report.id}</p>
                        <p className="card-description">{report.description}</p>
                        <button className="card-button">Review Report</button>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}
