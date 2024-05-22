// Importing necessary libraries and styles
import React, { useState } from "react";
import "../styles/Login.css"; // Importing CSS for styling
import { setLogin } from "../redux/state"; // Importing setLogin action from redux state
import { useDispatch } from "react-redux"; // Importing useDispatch hook from redux
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom for navigation

const LoginPage = () => {
  // State variable to hold email and password input values
  const [formData, setFormData] = useState({
    'email' : '',
    'password' : ''
  })

  // Dispatch function to dispatch actions to the Redux store
  const dispatch = useDispatch();

  // Navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handling form data change
  const handleChange = e => {

    // Setting the variables to the field form attributes
    const fieldName = e.target.name
    const value = e.target.value

    // function to set the formData state to the value of the forms
    setFormData({
      ...formData,
      [fieldName] : value
    })
  } 

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
		// Sending a POST request to the login endpoint with email and password
		const res = await fetch("http://127.0.0.1:5000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Setting content type to JSON
			},
			body: JSON.stringify(formData), // Stringifying email and password to JSON format
		});

		// assign the response data returned by the server to this variable
		const data = await res.json();

		// If login is successful
		if (res.ok) {

			// setting the user id and role to local storage because redux is being an ass
			localStorage.setItem("user_id", data.user_id);
			localStorage.setItem("role", data.role);
			localStorage.setItem("username", data.username)


			// Dispatching setLogin action with user id, username and email data to the Redux store
			dispatch(
				setLogin({
					data
				})
			);
			// Navigating to the home page after successful login
			alert("Login Successful!");
			navigate("/");
		} else {
			alert(`Login failed: ${data.error || "Unknown error"}`);
		}
	} catch (err) {
      // Logging error message in case of failure
      console.error(`Error: ${err.message}`);
    }
  };

  return (
		<div className="login">
			<div className="login_content">
				{/* Form for user login */}
				<form className="login_content_form" onSubmit={handleSubmit}>
					{/* Input for email */}
					<input
						type="email"
						name="email"
            value={formData.email}
						placeholder="Email"
						onChange={handleChange} // Updating email state on change
						required
					/>
					{/* Input for password */}
					<input
						type="password"
						name="password"
            value={formData.password}
						placeholder="Password"
						onChange={handleChange} // Updating password state on change
						required
						minLength="8"
						maxLength="20"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" //adding vakidations for the password format
					/>
					<small style={{color : 'white'}}>
						Password must be 8-20 characters long, contain at least
						one uppercase letter, one lowercase letter, one number,
						and one special character.
					</small>
					{/* Submit button for the form */}
					<button type="submit">LOG IN</button>
				</form>
				{/* Link to the registration page */}
				<a href="/register">Don't have an account? Sign In Here</a>
			</div>
		</div>
  );
};

export default LoginPage;
