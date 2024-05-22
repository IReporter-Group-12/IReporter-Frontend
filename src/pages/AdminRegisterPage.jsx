// Import necessary hooks and styles
import { useEffect, useState } from "react"; // useEffect and useState hooks from React
import { useNavigate } from "react-router-dom"; // useNavigate from react-router-dom for navigation
import "../styles/List.css"; // CSS for styling
import "../styles/Register.css"; // CSS for styling

// RegisterPage component
const AdminRegisterPage = () => {
	// State to manage form data
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		staff_no: "",
		password: "",
		confirmPassword: "",
		profileImage: null, // Profile image file
	});

	// Handle input changes
	const handleChange = (e) => {
		const { name, value, files } = e.target; // Get name, value, and files from the event target
		setFormData({
			...formData,
			[name]: name === "profileImage" ? files[0] : value, // If the input is for profileImage, set it as the file, otherwise set the value
		});
	};

	// State to manage password match validation
	const [passwordMatch, setPasswordMatch] = useState(true);

	// Effect to check password match whenever password or confirmPassword changes
	useEffect(() => {
		setPasswordMatch(
			formData.password === formData.confirmPassword ||
				formData.confirmPassword === ""
		);
	}, [formData.password, formData.confirmPassword]);

	// useNavigate hook for navigation
	const navigate = useNavigate();

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			console.log(formData)
			// Send a POST request to the server with the form data
			const res = await fetch("http://127.0.0.1:5000/admin/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

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
						placeholder="Staff Number"
						name="staff_no"
						value={formData.staff_no}
						type="number"
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
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" // Password vakidations
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
					<input
						id="image"
						type="file"
						name="profileImage"
						accept="image/*"
						style={{ display: "none" }}
						onChange={handleChange}
					/>
					<label htmlFor="image">
						<img src="/assets/addImage.png" alt="Upload option" />
						<p>Upload Your Photo</p>
					</label>
					{/* Show a preview of the uploaded image */}
					{formData.profileImage && (
						<img
							src={URL.createObjectURL(formData.profileImage)}
							alt="Profile preview"
							style={{ maxWidth: "80px" }}
						/>
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

export default AdminRegisterPage;
