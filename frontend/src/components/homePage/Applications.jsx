import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {   // en-GB → dd/mm/yyyy
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


function Applications({ applications, view, onEdit, onDelete, statusFilter, dateFilter }) {
  let filteredApps = applications;

  // ✅ Apply Status Filter
  if (statusFilter !== "all") {
    filteredApps = filteredApps.filter((app) => app.status === statusFilter);
  }

  // ✅ Apply Date Sorting
  filteredApps = [...filteredApps].sort((a, b) => {
    if (dateFilter === "newest") {
      return new Date(b.date) - new Date(a.date); // Newest first
    } else {
      return new Date(a.date) - new Date(b.date); // Oldest first
    }
  });

  // ✅ No applications at all
  if (applications.length === 0) {
    return (
      <div className="text-center p-6 rounded shadow">
        <p>No applications yet. Click "New Application" to get started!</p>
      </div>
    );
  }

  // ✅ No applications after filter
  if (filteredApps.length === 0) {
    return (
      <div className="text-center p-6 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded shadow">
        <p>No applications found for this filter.</p>
      </div>
    );
  }

  // ✅ Cards View
  if (view === "cards") {
    return (
      <div className="grid mt-13 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {filteredApps.map((app) => (
          <div
            key={app._id}   
            className="w-full p-4 rounded shadow border-2 border-gray-200 dark:border-gray-600"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-semibold">{app.position}</h3>
                <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {app.company}
                </p>
              </div>
              <span className="px-3 py-1 text-lg rounded bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                {app.status}
              </span>
            </div>
            <p className="text-lg">Applied: {formatDate(app.date)}</p>
            {app.followup && <p className="text-lg">Follow-up: {formatDate(app.followup)}</p>}
            {app.notes && (
              <p className="text-lg text-gray-600 dark:text-gray-500">
                Notes: {app.notes}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onEdit(app)}
                className="px-2 py-1 text-sm bg-yellow-600 text-white rounded"
              >
                Edit
              </button>
              <button
                // ✅ FIXED: use _id from MongoDB
                onClick={() => onDelete(app._id)}
                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ Table View
  return (
    <div className="overflow-x-auto mt-14 rounded shadow transition-colors border-1 border-gray-200 dark:border-gray-600">
      <table className="w-full text-left ">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-600">
            <th className="px-2 py-3">Position</th>
            <th className="px-2 py-3">Company</th>
            <th className="px-2 py-3">Date</th>
            <th className="px-2 py-3">Status</th>
            <th className="px-2 py-3">Follow-up</th>
            <th className="px-2 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps.map((app) => (
            <tr
              key={app._id}   
              className="border-b border-gray-200 dark:border-gray-600"
            >
              <td className="p-2">{app.position}</td>
              <td className="p-2">{app.company}</td>
              <td className="p-2">{app.date}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">{app.followup || "None"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEdit(app)}
                  className="px-2 py-1 text-sm bg-yellow-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(app._id)}   
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Applications;
