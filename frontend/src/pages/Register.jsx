import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try{
        e.preventDefault();
        if (!email.includes("@")) {
        alert("Enter a valid email");
          return;
}

      await dispatch(registerUser({ name, email, password }));
      navigate("/");
      toast.success("Registered successfully!");
    } catch (err) {
    toast.error(err.response?.data?.msg || "Registration failed");
  }
    
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
      </form>
    </div>
  );
}
