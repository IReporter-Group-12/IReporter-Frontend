import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/List.css";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/search/${search}`, {
        method: "GET",
      });

      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSearchListings();
    };
    fetchData();
  }, [search]); // Removed getSearchListings from dependency array as it's not needed

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      <div className="list">
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
      <Footer />
    </>
  );
};

export default SearchPage;
