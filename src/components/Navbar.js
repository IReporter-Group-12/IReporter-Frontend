// Importing necessary components and hooks from various libraries
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { setLogin } from "../redux/state";

// Importing CSS styles and variables for the Navbar component
import "../styles/Navbar.css";
import variables from "../styles/variables.css";
import { setLogout } from "../redux/state";

// Ensure the correct path for importing variables
// import variables from '/home/nasirisi/Desktop/phase 5/ireporter/src/styles/Variable.js';

const Navbar = () => {
  // State to manage the dropdown menu visibility
  const [dropdownMenu, setDropdownMenu] = useState(false);
  
  // Accessing user data from the Redux store
  const user = useSelector((state) => state.user);


  // Dispatch function to send actions to the Redux store
  const dispatch = useDispatch();
  
  // State to manage the search input value
  const [search, setSearch] = useState("");
  
  // Hook to programmatically navigate the user
  const navigate = useNavigate();


  const loggedIn = localStorage.getItem("logged_in")
console.log(loggedIn)

  return (
		<div className="navbar">
			{/* Logo linking to the homepage */}
			<a href="/">
				<img
					src="/assets/logo.png"
					alt="representation of the company or the government"
				/>
			</a>

			{/* <Link to="/user-dashboard" className="nav-button">User Dashboard</Link>
			<Link to="/admin-dashboard" className="nav-button">Admin Dashboard</Link> */}

			{/* Search bar section */}
			<div className="navbar_search">
				<input
					type="text"
					placeholder="Search ..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<IconButton disabled={search === ""}>
					<Search
						sx={{ color: variables.pinkred }}
						onClick={() => {
							navigate(`/properties/search/${search}`);
						}}
					/>
				</IconButton>
			</div>

			{/* Right section of the navbar */}
			<div className="navbar_right">


				<button
					className="navbar_right_account"
					onClick={() => setDropdownMenu(!dropdownMenu)}>
					<Menu sx={{ color: variables.darkgrey }} />
					{/* Display user icon or profile image based on authentication */}
					{!user ? (
						<Person sx={{ color: variables.darkgrey }} />
					) : (
						<img
							src={`http://localhost:3001/${user.profileImagePath.replace(
								"public",
								""
							)}`}
							alt="User's profile"
							style={{ objectFit: "cover", borderRadius: "50%" }}
						/>
					)}
				</button>

				{/* Dropdown menu for unauthenticated users */}
				{dropdownMenu && loggedIn && (
					<div className="navbar_right_accountmenu">
						<Link to="/login">Log In</Link>
						<Link to="/admin-register">Government Admin</Link>
					</div>
				)}

				{/* Dropdown menu for authenticated users */}
				{dropdownMenu && !loggedIn && (
					<div className="navbar_right_accountmenu">
						<Link
							to="/login"
							onClick={async () => {

								const res = await fetch("http://127.0.0.1:5000/logout",{
									method : "POST"
								})

								if (res.ok){
								localStorage.setItem('logged_in', false)
								localStorage.setItem("user_id", null)
								localStorage.setItem('username', null)
								localStorage.setItem("email", null)
								localStorage.setItem("role", null)
								localStorage.setItem("report_id", null)

								alert("You have been logged out successfully!")
								}
							}
							}>
							Log Out
						</Link>
					</div>
				)}

			</div>
		</div>
  );
};

// Exporting the Navbar component as the default export
export default Navbar;
