import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Slide from "../components/Slide";
import Categories from "../components/Categories";
import "../styles/Dashboard.css"


export default function UserDashboard() {

    const [corruptionReports, setCorruptionReports] = useState([])
    const [publicPetitions, setPublicPetitions] = useState([])

    // const user = useSelector((state) => state.user)
    const user_id = localStorage.getItem("user_id")
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username")

    console.log('Corruption Reports: ', corruptionReports)
    console.log('Public Petitions: ', publicPetitions)

    useEffect(
		() =>
			async function () {
				try {
					const res = await fetch(
						`http://127.0.0.1:5000/corruption_reports/${user_id}/`,
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
		[user_id]
	);

        useEffect(
			() =>
				async function () {
					try {
						const res = await fetch(
							`http://127.0.0.1:5000/public_petitions/${user_id}/`,
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
			[user_id]
		);

  return (
    <>
        <Slide />
        <Categories />

        <h2 className="section-header">Your Corruption Reports</h2>
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
                        <button className="card-button">Edit Report</button>
                    </div>
                </div>
            ))}
        </div>

        <h2 className="section-header">Your Public Petitions</h2>
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
                        <button className="card-button">Edit Report</button>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}
