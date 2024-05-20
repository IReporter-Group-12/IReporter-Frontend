import { categories } from "../data";
import "../styles/Categories.css";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const handleIconClick = (e, categoryLabel) => {
    e.preventDefault(); // Prevents the Link from being followed
    if (categoryLabel === "Report a corruption") {
      navigate("/corruption-form"); // Adjust the path as needed
    } else if (categoryLabel === "Public Petition") {
      navigate("/public-petition"); // Adjust the path as needed
    }
  };

  return (
    <div className="categories">
      <h1>Report Government Agencies and Ministries</h1>
      <p>
        Each ministry is typically responsible for a specific sector, such as health, education, or defense, ensuring that policies are effectively designed and executed. Agencies often operate under the umbrella of these ministries, focusing on specialized tasks like regulatory enforcement, data collection, and service delivery.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <Link to={`/properties/category/${category.label}`} key={index}>
            <div className="category">
              {category.img && <img src={category.img} alt={category.label} />}
              <div className="overlay"></div>
              <div className="category_text">
                <div
                  className="category_text_icon"
                  onClick={(e) => handleIconClick(e, category.label)}
                >
                  {category.icon}
                </div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
