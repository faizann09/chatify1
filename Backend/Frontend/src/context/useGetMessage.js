import { useEffect, useState } from "react";
import useConversation from "../stateManage/useConversation.js";
import axios from "axios";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      const convoId = selectedConversation?._id?.toString(); // ✅ Force string

      if (!convoId) {
        setMessages([]);
        return;
      }

      setLoading(true);
      try {
        const mappedId = convoId === "gemini-bot" ? "000000000000000000000001" : convoId;

        const response = await axios.get(`/api/message/get/${mappedId}`);

        const messages = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setMessages(messages);
      } catch (error) {
        console.error(
          "❌ Error fetching messages:",
          error?.response?.data || error.message
        );
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id]); // ✅ No need for full object in deps

  return { loading };
};

export default useGetMessage;
