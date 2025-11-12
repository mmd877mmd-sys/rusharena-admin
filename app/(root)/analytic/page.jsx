"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContactPage() {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");

  // Fetch messages from admin model (GET)
  const fetchMsg = async () => {
    try {
      const res = await axios.get(`/api/massage`, {
        params: { type: "msg" },
      });

      if (res?.data?.msg) {
        setMessages(res.data.msg);
      }
    } catch (err) {
      console.error("Error fetching marquee message:", err);
    }
  };

  useEffect(() => {
    fetchMsg();
  }, []);

  // Send message to admin (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(`/api/updateNumber`, {
        number: input,
        type: "msg",
      });
      if (res.data.success) {
        setInput("");
        fetchMessages(); // refresh message list
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-900 text-white">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!messages ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          <div
            className="p-3 rounded-xl max-w-full 
              
                  bg-green-600 self-end ml-auto1 "
          >
            {messages}
          </div>
        )}
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800 border-t  border-gray-700 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className=" w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className=" px-4 py-2 w-full bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}
