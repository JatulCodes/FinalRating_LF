import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { API } from "../../config/api.config";
import Auth from "../../Helpers/auth";
import { toast } from "react-toastify";

const SOCKET_SERVER_URL = API.hostUrlForSocket;
const userId = Auth.getUserData();

// const SOCKET_SERVER_URL = "https://api.leaderbridge.rejoicehub.com/";

const useMyquery = (setCustomMessage, fetchQuestionIHaveReceived, setOpenModal) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.emit("login", {
      userId: userId?._id,
    });

    socketRef.current.emit("connection");

    return () => {
      socketRef.current.disconnect();
    };
  }, [socketRef]);

  const SendConnectionRequest = (receiverId, message) => {
    socketRef.current.emit("add-connection", {
      user: Auth.getToken(),
      receiverId: receiverId,
      message: message,
    });
    setCustomMessage("Hi, I want to connect with you ..");
    fetchQuestionIHaveReceived();
    setOpenModal(false);
    toast.success("connection request sent");
  };

  const Blockuser = (userID) => {
    socketRef.current.emit("block-user", {
      user: Auth.getToken(),
      userId: userID,
    });
    setCustomMessage("Hi, I want to connect with you ..");
    fetchQuestionIHaveReceived();
    setOpenModal(false);
    toast.success("User blocked successfully");
  };

  return {
    SendConnectionRequest,
    Blockuser,
  };
};

export default useMyquery;
