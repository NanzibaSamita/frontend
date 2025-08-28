"use client";

import React, { useEffect, useState } from "react";

const CourseContent = () => {
  const [courses, setCourses] = useState([
    { name: "Machine Learning", credit: 3 },
    { name: "Pattern Recognition", credit: 3 },
    { name: "Deep Learning", credit: 1.5 },
  ]);

  // Set both heading and table in the same flex column with left padding
  return (
    <div className="px-10 max-w-[1100px] py-10">
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: 32,
          color: "#222",
        }}
      >
        Course Content
      </h1>
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          border: "1.5px solid #bdbdbd",
          width: "90%", // Or you can use "100%" if you want it flush to the padding
          minWidth: 400,
          boxShadow: "0 2px 8px rgba(60,60,60,0.04)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f6f8" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "18px 20px",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  borderBottom: "1.5px solid #bdbdbd",
                  color: "#333",
                  letterSpacing: "0.01em",
                }}
              >
                Course Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "18px 20px",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  borderBottom: "1.5px solid #bdbdbd",
                  color: "#333",
                  letterSpacing: "0.01em",
                  width: "200px",
                }}
              >
                Course Credit
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} style={{ borderTop: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    padding: "18px 20px",
                    fontSize: "1.08rem",
                    color: "#23272f",
                    fontWeight: 500,
                    borderBottom:
                      i === courses.length - 1 ? "none" : "1px solid #e0e0e0",
                  }}
                >
                  {c.name}
                </td>
                <td
                  style={{
                    padding: "18px 20px",
                    fontSize: "1.08rem",
                    color: "#23272f",
                    fontWeight: 500,
                    borderBottom:
                      i === courses.length - 1 ? "none" : "1px solid #e0e0e0",
                  }}
                >
                  {c.credit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseContent;
