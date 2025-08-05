// src/components/faculty/course-content/CourseModule.jsx
const CourseModule = ({ module }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ color: "#333", fontWeight: "bold" }}>{module.title}</h3>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>
        <strong>Description:</strong> {module.description}
      </p>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>
        <strong>Materials:</strong> {module.materials.join(", ")}
      </p>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>
        <strong>Status:</strong> {module.status}
      </p>
    </div>
  );
};

export default CourseModule;
