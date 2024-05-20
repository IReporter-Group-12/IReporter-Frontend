import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import "../styles/List.css";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties?category=${category}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.error("Fetch Listings Failed", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      {loading ? (
        <Loader />
      ) : listings && listings.length ? (
        <div className="list">
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
                {/* Replace this with how you want to display each listing */}
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
        <p>No listings available for {category}.</p>
      )}
      <Footer />
    </>
  );
};

export default CategoryPage;
