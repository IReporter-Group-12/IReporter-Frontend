// Importing necessary libraries and styles
import React, { useState } from "react";
import "../styles/Login.css"; // Importing CSS for styling
import { setLogin } from "../redux/state"; // Importing setLogin action from redux state
import { useDispatch } from "react-redux"; // Importing useDispatch hook from redux
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom for navigation

const LoginPage = () => {
  // State variables to hold email and password input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dispatch function to dispatch actions to the Redux store
  const dispatch = useDispatch();

  // Navigate function for programmatic navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Sending a POST request to the login endpoint with email and password
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting content type to JSON
        },
        body: JSON.stringify({ email, password }), // Stringifying email and password to JSON format
      });

      // Parsing the response to JSON
      const loggedIn = await response.json();

      // If login is successful
      if (loggedIn) {
        // Dispatching setLogin action with user and token data to the Redux store
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        // Navigating to the home page after successful login
        navigate("/");
      }
    } catch (err) {
      // Logging error message in case of failure
      console.log("Login failed", err.message);
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Updating email state on change
            required
          />
          {/* Input for password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updating password state on change
            required
          />
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
