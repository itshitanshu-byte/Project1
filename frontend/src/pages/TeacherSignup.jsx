import React, { useState } from "react";
import axios from "axios";

function TeacherSignup({ navigateTo, setTeacherSession, showBrutalAlert, API_BASE }) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("C. V. Raman Global University");
  const [branch, setBranch] = useState("CSE");
  const [group, setGroup] = useState("4");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const res = await axios.post(`${API_BASE}/teachers/login`, { email, password });
        setTeacherSession(res.data);
        sessionStorage.setItem("evalx_sess_teacher", JSON.stringify(res.data));
        if (res.data.status === "approved") {
          navigateTo("#teacher-dashboard");
        } else {
          navigateTo("#teacher-pending");
        }
      } catch (error) {
        showBrutalAlert("Login failed. Check your email and password.");
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE}/teachers/signup`, {
          name,
          email,
          password,
          college,
          branch,
          group
        });
        setTeacherSession(res.data);
        sessionStorage.setItem("evalx_sess_teacher", JSON.stringify(res.data));
        navigateTo("#teacher-pending");
      } catch (error) {
        showBrutalAlert(error.response?.data?.error || "Registration failed. Try again.");
      }
    }
  };

  return (
    <main id="page-teacher-signup" className="page active">
      <div className="fullscreen-split">
        <div className="split-left" style={{ background: "var(--color-green)" }}>
          <div>
            <span className="mono-tag">// REGISTRATION GATEWAY</span>
            <h2 style={{ fontSize: "3rem", lineHeight: 1, marginTop: "1rem", textTransform: "none" }}>
              {isLoginMode ? "Faculty Access" : "Faculty Registration"}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginTop: "1rem" }}>
              {isLoginMode
                ? "Enter your credentials to access the educator dashboard."
                : "Create your educator profile. Selecting group assignments triggers administrative authorization before active session."}
            </p>
          </div>
          <p style={{ fontSize: "0.75rem", fontWeight: 800 }}>
            SYSTEM SECURED // C. V. RAMAN GLOBAL UNIVERSITY DEPT. CSE
          </p>
        </div>

        <div className="split-right">
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", textTransform: "none" }}>
            {isLoginMode ? "Academic Node Authentication" : "Academic Account Creation"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="brutal-label">Full Faculty Name *</label>
                <input
                  type="text"
                  className="brutal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. R K Nayak"
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: "1.25rem", marginTop: "1.5rem" }}>
              <label className="brutal-label">Work Email Address *</label>
              <input
                type="email"
                className="brutal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. prof.nayak@cvrgi.edu.in"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem", marginTop: "1.5rem" }}>
              <label className="brutal-label">Access Password *</label>
              <input
                type="password"
                className="brutal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {!isLoginMode && (
              <>
                <div className="form-group" style={{ marginBottom: "1.25rem", marginTop: "1.5rem" }}>
                  <label className="brutal-label">Assigned College</label>
                  <select className="brutal-select" value={college} onChange={(e) => setCollege(e.target.value)}>
                    <option value="C. V. Raman Global University">C. V. Raman Global University (CVRGU)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem", marginTop: "1.5rem" }}>
                  <label className="brutal-label">Branch Department *</label>
                  <select className="brutal-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                    <option value="CSE">CSE</option>
                    <option value="CSIT">CSIT</option>
                    <option value="AIML">AIML</option>
                    <option value="AI&DS">AI&DS</option>
                    <option value="SE">SE</option>
                    <option value="CE">CE</option>
                    <option value="DS">DS</option>
                    <option value="WD">WD</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem", marginTop: "1.5rem" }}>
                  <label className="brutal-label">Assigned Group Lead (1-10) *</label>
                  <select className="brutal-select" value={group} onChange={(e) => setGroup(e.target.value)}>
                    <option value="1">Group 1</option>
                    <option value="2">Group 2</option>
                    <option value="3">Group 3</option>
                    <option value="4">Group 4</option>
                    <option value="5">Group 5</option>
                    <option value="6">Group 6</option>
                    <option value="7">Group 7</option>
                    <option value="8">Group 8</option>
                    <option value="9">Group 9</option>
                    <option value="10">Group 10</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
              <span
                onClick={() => setIsLoginMode(!isLoginMode)}
                style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
              >
                {isLoginMode ? "Need to create an account? Register here" : "Already registered? Login here"}
              </span>
            </div>

            <div className="form-navigation">
              <button type="button" className="brutal-btn" onClick={() => navigateTo("#home")} style={{ background: "#fff" }}>
                Back
              </button>
              <button type="submit" className="brutal-btn brutal-btn-dark">
                {isLoginMode ? "Authenticate" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default TeacherSignup;
