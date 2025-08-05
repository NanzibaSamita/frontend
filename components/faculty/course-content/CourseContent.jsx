// src/components/faculty/course-content/CourseContent.jsx
"use client";

import React, { useState } from "react";
import CourseModule from "./CourseModule"; // Importing the CourseModule component

const CourseContent = () => {
  // State for holding course modules
  const [modules, setModules] = useState([
    {
      title: "Introduction to Machine Learning",
      description: "Overview of ML, its history, and applications.",
      materials: ["Lecture Slides", "Reading Material"],
      status: "Planned",
    },
    {
      title: "Supervised Learning",
      description: "Introduction to regression, classification, etc.",
      materials: ["Lecture Slides", "Video Lecture"],
      status: "Planned",
    },
    {
      title: "Unsupervised Learning",
      description: "Clustering algorithms, PCA, etc.",
      materials: ["Lecture Slides", "Assignment Guide"],
      status: "Planned",
    },
    {
      title: "Neural Networks and Deep Learning",
      description: "Understanding deep neural networks and CNNs.",
      materials: ["Lecture Slides", "Reading Material"],
      status: "Planned",
    },
  ]);

  // Handlers for saving and canceling changes
  const handleSave = () => {
    alert("Changes Saved!");
  };

  const handleCancel = () => {
    alert("Changes Cancelled!");
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f9f9f9" }}>
      {/* Course Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#333", fontWeight: "bold" }}>Machine Learning</h1>
        <p style={{ color: "#555", fontSize: "1.2rem" }}>
          <strong>Instructor:</strong> John Doe
        </p>
        <p style={{ color: "#555", fontSize: "1.2rem" }}>
          <strong>Course Overview:</strong> This course will teach the
          fundamentals of machine learning. Topics include supervised learning,
          unsupervised learning, and deep learning applications.
        </p>
      </div>

      {/* Modules Overview */}
      <div>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>
          Modules Overview
        </h2>
        {modules.map((module, index) => (
          <CourseModule key={index} module={module} />
        ))}
      </div>

      {/* Save and Cancel Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: "12px 24px",
            fontSize: "1.1rem",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)",
          }}
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          style={{
            padding: "12px 24px",
            fontSize: "1.1rem",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#dc3545",
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(220, 53, 69, 0.2)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
