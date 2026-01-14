import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs } from "../store/gigSlice";
import { Link } from "react-router-dom";

export default function Gigs() {
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchGigs(search));
  }, [dispatch, search]);

  return (
    <div>
      
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search gigs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-3 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => dispatch(fetchGigs(search))}
          className="bg-indigo-600 text-white px-6 rounded-r hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      
      {loading ? (
        <p className="text-center">Loading gigs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold">{gig.title}</h3>
              <p className="text-gray-600 mt-2">
                {gig.description.length > 100
                  ? gig.description.slice(0, 100) + "..."
                  : gig.description}
              </p>
              <p className="mt-3 font-semibold text-indigo-600">
                ₹{gig.budget}
              </p>

              <Link
                to={`/gig/${gig._id}`}
                className="mt-4 inline-block text-indigo-600 font-semibold"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
