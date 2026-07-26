import React from "react";
import axios from "axios";

function TeacherPending({ teacher, setTeacherSession, handleLogout, navigateTo, showBrutalAlert, API_BASE }) {
  const handleCheckStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teachers/status/${teacher.email}`);
      const fresh = res.data.teacher;
      setTeacherSession(fresh);
      sessionStorage.setItem("evalx_sess_teacher", JSON.stringify(fresh));

      if (fresh.status === "approved") {
        showBrutalAlert("Congratulations! Your registration has been approved by the Administrator.", () => {
          navigateTo("#teacher-dashboard");
        });
      } else {
        showBrutalAlert("Request remains pending verification. Please contact the administrator.");
      }
    } catch (error) {
      showBrutalAlert("Failed to fetch validation status. Please try again.");
    }
  };

  return (
    <main id="page-teacher-pending" className="page active">
      <div className="fullscreen-split" style={{ gridTemplateColumns: "1fr" }}>
        <div
          className="split-right"
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "650px",
            margin: "0 auto",
            backgroundColor: "var(--bg-brutal)"
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "2rem", animation: "brutalSpin 5s linear infinite" }}>⏳</div>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem", textTransform: "none" }}>
            Administrative Validation Required
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Your request to lead{" "}
            <strong style={{ background: "var(--color-pink)", padding: "0.1rem 0.5rem", border: "2px solid #000", borderRadius: "5px" }}>
              {teacher.branch} - Group {teacher.group}
            </strong>{" "}
            has been logged. Security credentials must be authorized by system admins before active session.
          </p>

          <div
            style={{
              border: "var(--border-width) solid var(--border-brutal)",
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              width: "100%",
              textAlign: "left",
              fontSize: "0.85rem",
              marginBottom: "2rem",
              boxShadow: "4px 4px 0 #000"
            }}
          >
            <p>
              <b>Pending Account Identity:</b> <span>{teacher.email}</span>
            </p>
            <p style={{ marginTop: "0.25rem" }}>
              <b>Authority Node:</b> CV Raman Group Lead
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button className="brutal-btn brutal-btn-green" onClick={handleCheckStatus}>
              Check Approval Status
            </button>
            <button
              className="brutal-btn"
              onClick={handleLogout}
              style={{ color: "var(--color-danger)", borderColor: "var(--color-danger)", background: "#fff" }}
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TeacherPending;
