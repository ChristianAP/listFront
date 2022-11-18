import io from "socket.io-client";

const uri = import.meta.env.VITE_APP_SOCKET;

export const socketApi = io(String(uri), {
  transports: ["websocket", "polling", "flashsocket"],
});
