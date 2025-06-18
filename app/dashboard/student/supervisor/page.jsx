"use client";

import { useState } from "react";

export default function SupervisorPage() {
  const [supervisorStatus, setSupervisorStatus] = useState("Not Selected");
  const [supervisor, setSupervisor] = useState("");

  const handleSupervisorSelect = (selectedSupervisor) => {
    setSupervisor(selectedSupervisor);
    setSupervisorStatus("Selected");
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Supervisor Section */}
        <h2 className="text-3xl font-semibold text-black mb-8">Supervisor</h2>

        {/* Select Supervisor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <select
              onChange={(e) => handleSupervisorSelect(e.target.value)}
              className="w-[250px] py-2 px-6 bg-gray-50 border border-gray-300 rounded-md text-black"
              defaultValue="Not Selected"
            >
              <option value="Not Selected" disabled>
                Select Supervisor
              </option>
              <option value="Aashanan Rahman - Junior Lecturer">Aashanan Rahman - Junior Lecturer</option>
              <option value="Maliha Nousin Raida - Lecturer">Maliha Nousin Raida - Lecturer</option>
              <option value="Abu Raihan Mostofa Kamal - Professor">Abu Raihan Mostofa Kamal - Professor</option>
              <option value="Dr. Md. Azam Hossain - Associate Professor">Dr. Md. Azam Hossain - Associate Professor</option>
            </select>
            <button className="bg-green-600 text-white py-2 px-6 rounded-md">
              {supervisorStatus === "Not Selected" ? "Select" : "Selected"}
            </button>
          </div>
        </div>
      </div>

      {/* New Box for Supervisor Status */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        {/* Supervisor Status */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg text-gray-800 font-semibold">Supervisor Status</span>
          <span className="text-lg text-gray-600">
            {supervisorStatus === "Not Selected" ? supervisorStatus : supervisor}
          </span>
        </div>
      </div>
    </main>
  );
}
