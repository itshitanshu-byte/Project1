import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard({ handleLogout, showBrutalAlert, showBrutalConfirm, API_BASE }) {
  const [teachers, setTeachers] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchAdminData = async () => {
    try {
      const resTeachers = await axios.get(`${API_BASE}/admin/teachers`);
      setTeachers(resTeachers.data);

      const resStudents = await axios.get(`${API_BASE}/students`);
      setTotalStudents(resStudents.data.length);
    } catch (error) {
      showBrutalAlert("Failed to fetch administrator data.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (email, name) => {
    try {
      await axios.put(`${API_BASE}/admin/teachers/${email}/approve`);
      showBrutalAlert(`Success: Approved registration for ${name}.`);
      fetchAdminData();
    } catch (error) {
      showBrutalAlert("Failed to approve teacher.");
    }
  };

  const handleReject = async (email) => {
    showBrutalConfirm("Are you sure you want to decline this registration request?", async () => {
      try {
        await axios.delete(`${API_BASE}/admin/teachers/${email}`);
        showBrutalAlert("Verification request rejected.");
        fetchAdminData();
      } catch (error) {
        showBrutalAlert("Failed to reject request.");
      }
    });
  };

  const approvedTeachers = teachers.filter((t) => t.status === "approved");
  const pendingTeachers = teachers.filter((t) => t.status === "pending");

  return (
    <div className="brutal-grid-layout" style={{ marginTop: "1rem" }}>
      <aside className="brutal-sidebar">
        <div style={{ textAlign: "center", paddingBottom: "2rem", borderBottom: "2px solid var(--border-brutal)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💻</div>
          <h3 style={{ textTransform: "none" }}>Master Node</h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>ADMINISTRATOR</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="nav-item active">⚙️ DEPLOYMENT</div>
          <div className="nav-item nav-item-danger" onClick={handleLogout} style={{ marginTop: "4rem" }}>
            🚪 EXIT CONTROL
          </div>
        </div>
      </aside>

      <section className="brutal-content-area">
        <div className="dashboard-panel">
          <span className="mono-tag" style={{ background: "var(--color-yellow)", border: "1px solid #000", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>
            // MASTER CONTROL DATABASE STATS
          </span>
          <h2 style={{ fontSize: "2.5rem", marginTop: "0.75rem", marginBottom: "2rem", textTransform: "none" }}>System Overviews</h2>

          <div className="dashboard-card-grid">
            <div className="dashboard-metrics-card secondary" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE FACULTY ROSTER</p>
              <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3rem", fontWeight: "900", lineHeight: 1, color: "#000", margin: 0 }}>
                {approvedTeachers.length}
              </p>
            </div>
            <div className="dashboard-metrics-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700 }}>TOTAL STUDENT ENROLLMENTS</p>
              <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3rem", fontWeight: "900", lineHeight: 1, color: "#000", margin: 0 }}>
                {totalStudents}
              </p>
            </div>
            <div className="dashboard-metrics-card accent" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700 }}>PENDING TEACHER APPROVALS</p>
              <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3rem", fontWeight: "900", lineHeight: 1, color: "#000", margin: 0 }}>
                {pendingTeachers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textTransform: "none" }}>Pending Validation Requests</h3>
          <div className="data-table-container">
            {pendingTeachers.length === 0 ? (
              <div style={{ padding: "3rem 0", textAlign: "center", borderRadius: "12px", background: "var(--bg-brutal)" }}>
                <p style={{ color: "var(--text-muted)", fontWeight: 700 }}>All pending registration requests resolved.</p>
              </div>
            ) : (
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "3px solid var(--border-brutal)", fontFamily: "var(--font-brutal-mono)", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                    <th style={{ padding: "1rem" }}>TEACHER NAME</th>
                    <th style={{ padding: "1rem" }}>EMAIL ADDRESS</th>
                    <th style={{ padding: "1rem" }}>COLLEGE</th>
                    <th style={{ padding: "1rem" }}>BRANCH</th>
                    <th style={{ padding: "1rem" }}>GROUP LEAD</th>
                    <th style={{ padding: "1rem" }}>VERIFICATION</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTeachers.map((t, idx) => (
                    <tr key={idx}>
                      <td><b>{t.name}</b></td>
                      <td>{t.email}</td>
                      <td>{t.college}</td>
                      <td><span className="badge badge-primary">{t.branch}</span></td>
                      <td>Group {t.group}</td>
                      <td>
                        <button
                          className="brutal-btn"
                          onClick={() => handleApprove(t.email, t.name)}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", background: "var(--color-success)", boxShadow: "none", marginRight: "8px" }}
                        >
                          Approve
                        </button>
                        <button
                          className="brutal-btn"
                          onClick={() => handleReject(t.email)}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", background: "var(--color-danger)", boxShadow: "none" }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textTransform: "none" }}>Approved Faculty Roster</h3>
          <div className="data-table-container">
            {approvedTeachers.length === 0 ? (
              <div style={{ padding: "3rem 0", textAlign: "center", borderRadius: "12px", background: "var(--bg-brutal)" }}>
                <p style={{ color: "var(--text-muted)", fontWeight: 700 }}>No educators authorized yet.</p>
              </div>
            ) : (
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "3px solid var(--border-brutal)", fontFamily: "var(--font-brutal-mono)", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                    <th style={{ padding: "1rem" }}>TEACHER NAME</th>
                    <th style={{ padding: "1rem" }}>EMAIL</th>
                    <th style={{ padding: "1rem" }}>COLLEGE</th>
                    <th style={{ padding: "1rem" }}>BRANCH GROUP</th>
                    <th style={{ padding: "1rem" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTeachers.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.name}</td>
                      <td>{t.email}</td>
                      <td>{t.college}</td>
                      <td><span className="badge badge-secondary">{t.branch} - Group {t.group}</span></td>
                      <td><span className="badge badge-success">Authorized</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
