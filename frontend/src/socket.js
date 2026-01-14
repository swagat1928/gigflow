import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false  
});

let joinedUserId = null;

export const initSocket = (userId) => {
  console.log("initSocket called with:", userId);

  if (!userId) return;

  if (!socket.connected) {
    socket.connect();
    console.log("socket.connect() called");
  }

  if (joinedUserId === userId) return;

  joinedUserId = userId;
  socket.emit("join", userId);
  console.log(" Joined socket room:", userId);
};

export const disconnectSocket = () => {
  console.log(" disconnectSocket called");
  joinedUserId = null;
  socket.disconnect();
};


socket.on("hired-notification", (data) => {
  console.log(" Hire notification received:", data);
  toast.success(data.message);
});
