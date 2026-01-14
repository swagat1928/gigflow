import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store.js";
import App from "./App.jsx";
import { initSocket } from "./socket.js";
import { socket } from "./socket";
import { fetchMe } from "./store/authSlice.js";
import "./index.css";
import { Toaster } from "react-hot-toast"; 
import Notifications from "./components/Notifications.jsx";


function AppWrapper() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    
    dispatch(fetchMe());
  }, [dispatch]);

  
  useEffect(() => {
    if (user && user.id) {
      
      initSocket(user.id);
    }
  }, [user]);

  return (
    <>
      <App />
      {user && <Notifications />}   {/* 🔔 HERE */}
    </>
  );
}



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </React.StrictMode>
);
