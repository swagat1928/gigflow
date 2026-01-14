import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { submitBid, fetchBids, hireBid } from "../store/bidSlice";
import toast from "react-hot-toast";

export default function GigDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bids } = useSelector((state) => state.bids);

  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const gigRes = await api.get(`/gigs/${id}`);
      setGig(gigRes.data);

      const meRes = await api.get("/auth/me");
      setUser(meRes.data);

      dispatch(fetchBids(id));
    };
    load();
  }, [id, dispatch]);

  const isOwner =
    user && (user._id === gig?.ownerId?._id || user._id === gig?.ownerId);

  const handleBid = async () => {
    if (!message || !price) return;

    await dispatch(submitBid({ gigId: id, message, amount: price }));
    setMessage("");
    setPrice("");
    dispatch(fetchBids(id));
    toast.success("Bid submitted successfully!");
  };

  const handleHire = async (bidId) => {
    await dispatch(hireBid(bidId));
    dispatch(fetchBids(id));
  };


  if (!gig) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-3xl font-bold">{gig.title}</h2>
        <p className="text-gray-600 mt-2">{gig.description}</p>
        <p className="mt-4 text-xl font-semibold text-indigo-600">
          ₹{gig.budget}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Status: {gig.status}
        </p>
      </div>

      
      {!isOwner && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-xl font-bold mb-4">Place a Bid</h3>

          <textarea
            placeholder="Write a proposal..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="number"
            placeholder="Your price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleBid}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Submit Bid
          </button>
        </div>
      )}

      
      {isOwner && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Bids</h3>

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="border p-4 rounded-lg mb-4 flex justify-between items-center"
            >
              <div>
               
                <p className="font-bold">{bid.bidderId.name}</p> 
                <p className="text-gray-600">{bid.proposal}</p>
                <p className="mt-1 font-semibold">Bid Amount: ₹{bid.amount}</p>
                <p className="text-sm">Status: {bid.status}</p>
              </div>

              {bid.status === "pending" && (
                <button
                  onClick={() => handleHire(bid._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Hire
                </button>
              )}

              {bid.status === "accepted" && (
                <span className="text-green-600 font-bold">Hired</span>
              )}

              {bid.status === "rejected" && (
                <span className="text-red-500 font-bold">Rejected</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
