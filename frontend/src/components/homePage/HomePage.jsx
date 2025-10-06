import React, { useState, useEffect } from "react";
import Header from "./Header";
import Controls from "./Controls";
import Applications from "./Applications";
import Modal from "./Modal";
import { fetchApplications } from "../../services/applicationService";
import axiosInstance from "../../utils/axiosInstance";


const HomePage = () => {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("cards");
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("newest");

  // ✅ Initial load: dark mode from localStorage + fetch apps from server
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
    loadApplications();
  }, []);

  // ✅ Fetch apps from backend
  const loadApplications = async () => {
    try {
      const res = await fetchApplications();
      setApplications(res);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // ✅ Refresh when save
  const addOrUpdateApplication = () => {
    loadApplications();
    setIsModalOpen(false);
    setEditApp(null);
  };

  // ✅ Delete app
  const deleteApplication = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/applications/${id}`);
      loadApplications();
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const openModal = (app = null) => {
    setEditApp(app);
    setIsModalOpen(true);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-gray-100 text-black min-h-screen"
      }
    >
      <div className="max-w-5xl mx-auto p-6">
        <Header />
        <Controls
          view={view}
          setView={setView}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          openModal={openModal}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <Applications
          applications={applications}
          view={view}
          onEdit={openModal}
          onDelete={deleteApplication}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onSave={addOrUpdateApplication}
            darkMode={darkMode}
            editApp={editApp}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
