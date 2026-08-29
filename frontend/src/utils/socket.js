import { io } from "socket.io-client";

const SOCKET_URL =
  "https://asan-driverapp.onrender.com";

export const socket =
  io(
    SOCKET_URL,
    {
      transports: [
        "websocket",
        "polling",
      ],

      reconnection:
        true,

      autoConnect:
        true,
    }
  );