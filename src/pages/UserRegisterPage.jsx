// Import necessary hooks and styles
import { useEffect, useState } from "react"; // useEffect and useState hooks from React
import { useNavigate } from "react-router-dom"; // useNavigate from react-router-dom for navigation
import "../styles/Register.css"; // CSS for styling

// RegisterPage component
const UserRegisterPage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null, // Profile image file
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Get name, value, and files from the event target
    setFormData({
      ...formData,
      [name]: value, // If the input is for profileImage, set it as the file, otherwise set the value
    });
  };

  // State to manage password match validation
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Effect to check password match whenever password or confirmPassword changes
  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
  }, [formData.password, formData.confirmPassword]);

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
		// Send a POST request to the server with the form data
		const res = await fetch(
			"https://ireporter-api.onrender.com/user/register",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			}
		);

		// assign the response data returned by the server to this variable
		const data = await res.json();

		// If the response is successful, navigate to the login page
		if (res.ok) {
			alert("Registration Successful!");
			navigate("/login");
		} else {
			alert(`Registration failed: ${data.error || "Unknown error"}`);
		}
	} catch (err) {
		// Logging error message in case of failure
		console.error(`Error: ${err.message}`);
	}
  };

  // Render the registration form
  return (
		<div className="register">
		  <h1 style={{ color: "white" }}>SIGN UP</h1>

			<div className="register_content">
				<form className="register_content_form" onSubmit={handleSubmit}>
					<input
						placeholder="Full Name"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						required
					/>
					<input
						placeholder="Email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
					<input
						placeholder="Password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						type="password"
						required
						minLength="8"
						maxLength="20"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" //password validations
					/>
					<input
						placeholder="Confirm Password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						type="password"
						required
					/>{" "}
					<small style={{ color: "white" }}>
						Password must be 8-20 characters long, contain at least
						one uppercase letter, one lowercase letter, one number,
						and one special character.
					</small>

					{/* Show a message if passwords do not match */}
					{!passwordMatch && (
						<p style={{ color: "red" }}>
							Passwords are not matched!
						</p>
					)}
					<button type="submit" disabled={!passwordMatch}>
						REGISTER
					</button>
				</form>
				<a href="/login">Already have an account? Log In Here</a>
			</div>
		</div>
  );
};

export default UserRegisterPage;
