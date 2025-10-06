import React, { useState, useEffect } from "react";
import {
  createApplication,
  updateApplication,
} from "../../services/applicationService";

function Modal({ onClose, onSave, darkMode, editApp }) {
  const [form, setForm] = useState({
    position: "",
    company: "",
    date: "",
    status: "applied",
    followup: "",
    notes: "",
  });

  useEffect(() => {
    if (editApp) {
      setForm({
        ...editApp,
        date: editApp.date
          ? new Date(editApp.date).toISOString().split("T")[0]
          : "",
        followup: editApp.followup
          ? new Date(editApp.followup).toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm((prev) => ({
        ...prev,
        id: Date.now().toString(),
        date: "",
        followup: "",
      }));
    }
  }, [editApp]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editApp && form._id) {
        // ✅ Update existing (must use MongoDB _id)
        await updateApplication(form._id, form);
      } else {
        // ✅ Create new (don’t send _id)
        const { _id, ...newApp } = form;
        await createApplication(newApp);
      }
      onSave(); // trigger parent refresh
      onClose();
    } catch (err) {
      console.error("Error saving app:", err);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-50">
      <div className="p-6 rounded shadow-lg w-full max-w-md transition-colors border border-gray-300 dark:border-gray-600 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editApp ? "Edit" : "Add"} Application
          </h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-lg font-bold">Position*</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-lg font-bold">Company*</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-lg font-bold">Application Date*</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-lg font-bold">Status*</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            >
              <option value="applied">Applied</option>
              <option value="waiting">Waiting</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-bold">Follow-up Date</label>
            <input
              type="date"
              name="followup"
              value={form.followup}
              onChange={handleChange}
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-lg font-bold">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className={`w-full border border-gray-300 dark:border-gray-600 p-2 rounded ${
                darkMode ? "bg-gray-900" : ""
              }`}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
