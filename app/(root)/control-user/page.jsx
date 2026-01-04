"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "@/app/component/application/tostify";

export default function AdminUserControl() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users");
      if (res.data.success) {
        setUsers(res.data.data || []);
        setFilteredUsers(res.data.data || []);
      } else {
        showToast("error", res.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by name in real-time
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter((u) => u.name?.toLowerCase().includes(term))
      );
    }
  }, [searchTerm, users]);

  const handleInputChange = (userId, field, value) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, [field]: Number(value) } : user
      )
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("info", "Copied to clipboard!");
  };

  // Update balances
  const updateBalance = async (userId, winbalance, dipositbalance) => {
    try {
      setUpdatingId(userId);
      const res = await axios.put("/api/users", {
        userId,
        winbalance,
        dipositbalance,
      });

      if (res.data.success) {
        showToast("info", "User balances updated successfully!");
        fetchUsers();
      } else {
        showToast("error", res.data.message || "Failed to update balances");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update balances");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-gray-100">
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">
        Total Users: <span className="text-yellow-600">{users.length}</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
        />
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-400 text-center">No users found.</p>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="p-5 bg-[#443838] rounded-xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white mb-3">
                  {user.name}
                </h2>{" "}
                <button
                  onClick={() => copyToClipboard(user._id)}
                  className="text-xs bg-green-600 hover:bg-blue-700 px-2 py-1 rounded-md text-white"
                >
                  Copy Token
                </button>
              </div>
              {/* User Info Fields */}
              {[
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Password", value: user.password },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-t border-b border-gray-700 py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-white font-medium break-all">
                      {item.value || "N/A"}
                    </p>
                  </div>
                  {item.value && (
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md text-white"
                    >
                      Copy
                    </button>
                  )}
                </div>
              ))}

              {/* Balances */}
              <div className="flex gap-4 mt-3">
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-300">
                    Win Balance
                  </label>
                  <input
                    type="number"
                    value={user.winbalance ?? ""}
                    onChange={(e) =>
                      handleInputChange(user._id, "winbalance", e.target.value)
                    }
                    className="border border-gray-700 bg-gray-800 text-white p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-300">
                    Deposit Balance
                  </label>
                  <input
                    type="number"
                    value={user.dipositbalance ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        user._id,
                        "dipositbalance",
                        e.target.value
                      )
                    }
                    className="border border-gray-700 bg-gray-800 text-white p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={() =>
                  updateBalance(user._id, user.winbalance, user.dipositbalance)
                }
                disabled={updatingId === user._id}
                className={`mt-4 px-4 py-2 rounded-md font-medium text-white transition w-full ${
                  updatingId === user._id
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updatingId === user._id ? "Updating..." : "Save Changes"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
