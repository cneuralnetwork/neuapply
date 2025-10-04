import React from "react";

function Controls({
  view,
  setView,
  darkMode,
  toggleDarkMode,
  openModal,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <section className="flex flex-wrap justify-between items-center gap-4 mb-6">
      {/* Left Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          + New Application
        </button>

        <button
          onClick={() => setView(view === "cards" ? "table" : "cards")}
          className="px-4 py-2 border-2 rounded font-bold"
        >
          Toggle View
        </button>

        </div>

        <div className="flex gap-3 items-center">

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="waiting">Waiting</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border-2 rounded"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Right Controls (Dark Mode) */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          ☀️
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="hidden"
          />
          <span className="w-12 h-5 bg-gray-400 rounded-full relative">
            <span
              className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? "translate-x-7" : "translate-x-0"
              }`}
            ></span>
          </span>
          🌙
        </label>
      </div>
    </section>
  );
}

export default Controls;
