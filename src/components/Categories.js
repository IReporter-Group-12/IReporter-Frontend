// Import the categories data from the specified path
import { categories } from "../data";
// Import the CSS styles for the Categories component
import "../styles/Categories.css";
// Import Link and useNavigate from react-router-dom for navigation purposes
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  // useNavigate hook is used to programmatically navigate the user
  const navigate = useNavigate();

  // Function to handle icon click events
  const handleIconClick = (e, categoryLabel) => {
    e.preventDefault(); // Prevent the default behavior of the link
    // Navigate to specific paths based on the category label
    if (categoryLabel === "Report a corruption") {
      navigate("/corruption-form"); // Navigate to the corruption report form
    } else if (categoryLabel === "Public Petition") {
      navigate("/public-petition"); // Navigate to the public petition page
    }
  };

  return (
    <div className="categories">
      <h1>Report Government Agencies and Ministries</h1>
      <p>
        Each ministry is typically responsible for a specific sector, such as health, education, or defense, ensuring that policies are effectively designed and executed. Agencies often operate under the umbrella of these ministries, focusing on specialized tasks like regulatory enforcement, data collection, and service delivery.
      </p>

      <div className="categories_list">
        {/* Map through a subset of categories and display each one */}
        {categories?.slice(1, 7).map((category, index) => (
          // Link component for each category leading to a specific path
          <Link to={`/properties/category/${category.label}`} key={index}>
            <div className="category">
              {/* Conditionally render the category image if it exists */}
              {category.img && <img src={category.img} alt={category.label} />}
              <div className="overlay"></div>
              <div className="category_text">
                {/* Div for icon click handling, triggering the handleIconClick function */}
                <div
                  className="category_text_icon"
                  onClick={(e) => handleIconClick(e, category.label)}
                >
                  {category.icon}
                </div>
                {/* Display the category label */}
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Export the Categories component as the default export
export default Categories;
