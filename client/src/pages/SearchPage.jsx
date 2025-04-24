import { useParams } from "react-router-dom";
import "../styles/List.scss";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState, useCallback } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);

  const dispatch = useDispatch();

  const getSearchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:3001/properties/search/${search}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      dispatch(setListings({ listings: data }));
    } catch (err) {
      setError(err.message);
      console.error("Fetch Search List failed:", err);
    } finally {
      setLoading(false);
    }
  }, [search, dispatch]);

  useEffect(() => {
    getSearchListings();
  }, [getSearchListings]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="search-container">
        <h1 className="title-list">Search Results: {search}</h1>
        
        {error ? (
          <div className="error-message">
            Error loading listings: {error}
          </div>
        ) : listings?.length === 0 ? (
          <div className="no-results">
            No properties found matching "{search}"
          </div>
        ) : (
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
                <ListingCard
                  key={_id}  // Added key prop
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              )
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;