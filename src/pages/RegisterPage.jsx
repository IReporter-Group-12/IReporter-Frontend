// Import necessary hooks and styles
import { useEffect, useState } from "react"; // useEffect and useState hooks from React
import { useNavigate } from "react-router-dom"; // useNavigate from react-router-dom for navigation
import "../styles/List.css"; // CSS for styling
import "../styles/Register.css"; // CSS for styling

// RegisterPage component
const RegisterPage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
  }, [formData.password, formData.confirmPassword]);

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object to send the form data
      const register_form = new FormData();

      // Append each form field to the FormData object
      for (var key in formData) {
        register_form.append(key, formData[key]);
      }

      // Send a POST request to the server with the form data
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });

      // If the response is successful, navigate to the login page
      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.message); // Log any error that occurs during registration
    }
  };

  // Render the registration form
  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
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
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {/* Show a message if passwords do not match */}
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
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

export default RegisterPage;
