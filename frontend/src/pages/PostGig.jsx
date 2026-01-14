import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGig } from "../store/gigSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PostGig() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !budget) {
      setError("All fields are required");
      return;
    }

    try {
      await dispatch(createGig({ title, description, budget })).unwrap();
      navigate("/");
      toast.success("Gig posted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to post gig");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Post a New Gig</h2>

      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          rows="4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Post Gig
        </button>
      </form>
    </div>
  );
}
