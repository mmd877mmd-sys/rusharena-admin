"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContactPage() {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");

  // NEW states for notification inputs
  const [customText, setCustomText] = useState(""); // first input empty
  const defaultNotificationText =
    "রুম আইডি পাস দেওয়া হয়েছে ম্যাচ এ জয়েন করো।"; // second input fixed

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
        fetchMsg(); // refresh message list
      }
    } catch (error) {
      console.log(error);
    }
  };

  // NEW — Send notification request to Firebase route
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();

    // Join both inputs into one message
    const finalMessage = `${customText} ${defaultNotificationText}`.trim();

    if (!finalMessage) return;

    try {
      const res = await axios.post(`/api/sendNotification`, {
        text: finalMessage,
      });

      if (res.data.success) {
        setCustomText(""); // clear only first input
        alert("Notification request sent!");
      }
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-900 text-white">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!messages ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          <div className="p-3 rounded-xl max-w-full bg-green-600 self-end">
            {messages}
          </div>
        )}
      </div>

      {/* Form 1 — Send message to Admin */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 w-full bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Save Message
        </button>
      </form>

      {/* NEW — Send Notification */}
      <div className="w-full text-2xl items-center justify-center text-center my-4">
        <h2>Send Notification</h2>
      </div>

      <form
        onSubmit={handleNotificationSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700 items-center"
      >
        {/* Input 1: Custom message (Empty always) */}
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Match Name"
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />

        {/* Input 2: Default fixed message */}
        <input
          type="text"
          value={defaultNotificationText}
          disabled
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-gray-300 outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 w-full bg-purple-600 rounded-lg hover:bg-purple-500"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
}
