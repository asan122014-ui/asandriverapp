import { io } from "socket.io-client";

const socket = io("https://asan-driverapp.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5
});

export default socket;