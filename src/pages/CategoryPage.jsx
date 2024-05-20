// Importing necessary hooks and components
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import "../styles/List.css";

const CategoryPage = () => {
  // State to manage the loading status
  const [loading, setLoading] = useState(true);
  
  // Retrieving the category parameter from the URL
  const { category } = useParams();
  
  // Initializing dispatch to send actions to the Redux store
  const dispatch = useDispatch();
  
  // Selecting listings from the Redux store
  const listings = useSelector((state) => state.listings);

  // Function to fetch listings from the server based on category
  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties?category=${category}`,
        {
          method: "GET",
        }
      );

      // Check if the response is not OK
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      // Parse the response data
      const data = await response.json();
      // Dispatch the setListings action to update the Redux store
      dispatch(setListings({ listings: data }));
      // Update the loading state to false
      setLoading(false);
    } catch (err) {
      // Log the error message to the console
      console.error("Fetch Listings Failed", err.message);
      // Update the loading state to false
      setLoading(false);
    }
  };

  // useEffect hook to fetch listings when the component mounts or category changes
  useEffect(() => {
    getFeedListings();
  }, [category]);

  return (
    <>
      {/* Navbar component */}
      <Navbar />
      {/* Title displaying the current category */}
      <h1 className="title-list">{category} listings</h1>
      {/* Conditional rendering based on the loading state and listings data */}
      {loading ? (
        <Loader /> // Show loader while data is being fetched
      ) : listings && listings.length ? (
        <div className="list">
          {/* Map through the listings and display each one */}
          {listings.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <div key={_id} className="listing-item">
                {/* Display each listing's details */}
                <h2>{city}, {province}, {country}</h2>
                <p>Category: {category}</p>
                <p>Type: {type}</p>
                <p>Price: ${price}</p>
                <p>Creator: {creator}</p>
                <p>Booking: {booking ? "Available" : "Not Available"}</p>
              </div>
            )
          )}
        </div>
      ) : (
        <p>No listings available for {category}.</p> // Show message if no listings are available
      )}
      {/* Footer component */}
      <Footer />
    </>
  );
};

// Exporting the CategoryPage component as the default export
export default CategoryPage;
