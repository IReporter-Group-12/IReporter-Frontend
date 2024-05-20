// Import necessary modules and components
import { useParams } from "react-router-dom"; // useParams hook to access parameters from the URL
import { useSelector, useDispatch } from "react-redux"; // useSelector and useDispatch hooks from react-redux for accessing and dispatching Redux state
import { setListings } from "../redux/state"; // Action creator to set listings in Redux state
import { useEffect, useState } from "react"; // useEffect and useState hooks from React
import Loader from "../components/Loader"; // Loader component for displaying loading state
import Navbar from "../components/Navbar"; // Navbar component
import Footer from "../components/Footer"; // Footer component
import "../styles/List.css"; // CSS for styling

// SearchPage component
const SearchPage = () => {
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // Get search term from URL parameters
  const { search } = useParams();

  // Redux state to store listings
  const listings = useSelector((state) => state.listings);

  // Redux dispatch function
  const dispatch = useDispatch();

  // Function to fetch search listings from the server
  const getSearchListings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/search/${search}`, {
        method: "GET",
      });

      // Parse response data
      const data = await response.json();

      // Dispatch action to set listings in Redux state
      dispatch(setListings({ listings: data }));

      // Set loading state to false
      setLoading(false);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message); // Log error if fetching listings fails
    }
  };

  // Effect to fetch search listings when search term changes
  useEffect(() => {
    const fetchData = async () => {
      await getSearchListings(); // Fetch search listings
    };
    fetchData();
  }, [search]); // Dependency array includes 'search' to re-fetch listings when search term changes

  // Render loader while loading, otherwise render listings
  return loading ? (
    <Loader /> // Display loader component while loading
  ) : (
    <> {/* Fragment for multiple adjacent elements */}
      <Navbar /> {/* Render Navbar component */}
      <h1 className="title-list">{search}</h1> {/* Display search term as title */}
      <div className="list"> {/* Container for listing items */}
        {/* Map over listings and render each listing */}
        {listings?.map(
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
            <div key={_id} className="listing-item"> {/* Listing item container */}
              {/* Display listing details */}
              <h2>{city}, {province}, {country}</h2> {/* City, province, and country */}
              <p>Category: {category}</p> {/* Listing category */}
              <p>Type: {type}</p> {/* Listing type */}
              <p>Price: ${price}</p> {/* Listing price */}
              <p>Creator: {creator}</p> {/* Listing creator */}
              <p>Booking: {booking ? "Available" : "Not Available"}</p> {/* Booking availability */}
            </div>
          )
        )}
      </div>
      <Footer /> {/* Render Footer component */}
    </>
  );
};

export default SearchPage; // Export SearchPage component
