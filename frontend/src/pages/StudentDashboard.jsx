import React, { useState, useEffect } from "react";
import axios from "axios";

const REMEDIAL_GUIDES = {
  "Mathematics - I": {
    focus: "Differential & Integral Calculus, Matrices, Eigenvalues",
    guide: "Spend 20 mins daily on matrices operations. Review the foundation of limits and differentiation. Focus on the physical applications of double integrals.",
    resources: "Khan Academy (Linear Algebra), Professor Leonard (Calculus I & II), MIT OpenCourseWare (18.01)."
  },
  "Mathematics - II": {
    focus: "Vector Calculus, Ordinary Differential Equations, Laplace Transforms",
    guide: "Learn Laplace transforms by plotting them dynamically. Break down vector integration using line and surface integrals.",
    resources: "3Blue1Brown (Essence of Calculus), NPTEL Lectures by Prof. J. Kumar."
  },
  "Basic Electronics Engineering": {
    focus: "PN Junction Diodes, BJT Configuration, Operational Amplifiers (Op-Amps)",
    guide: "Simulate circuits using LTspice (free). Draw diode characteristics curves and practice operational amplifier calculations (gain, invert/non-invert).",
    resources: "Neso Academy (Electronics Series), All About Circuits textbook guides."
  },
  "Data Structures": {
    focus: "Pointers, LinkedList traversal, Stack/Queue implementations, Tree Traversals",
    guide: "Practice code implementations on paper before writing in IDE. Walk through tree traversals (inorder, preorder, postorder) node-by-node.",
    resources: "GeeksforGeeks (Data Structures), Abdul Bari's Algorithms & Data Structures YouTube playlist."
  },
  "Design & Analysis of Algorithms": {
    focus: "Asymptotic Notation, Divide & Conquer, Dynamic Programming, Greedy Algorithms",
    guide: "Focus on Master's Theorem for recurrence relations. Build recursion trees. Solve classic DP problems (0/1 Knapsack, LCS) step-by-step.",
    resources: "MIT 6.006 Introduction to Algorithms (YouTube), LeetCode (tags: recursion, dynamic-programming)."
  },
  "Digital Logic Design": {
    focus: "K-Map minimization, Multiplexers, Counters, Flip-Flops",
    guide: "Solve K-Maps daily. Draw state diagrams for sequential flip-flops (T, D, JK) and understand synchronous vs asynchronous clock cycles.",
    resources: "Neso Academy (Digital Electronics playlist), CircuitVerse simulator."
  },
  "Discrete Mathematics": {
    focus: "Set Theory, Graph Theory, Propositional Logic, Combinatorics",
    guide: "Understand truth tables and practice boolean logic proofs. Focus on graph properties (Eulerian paths, trees) which are critical for computer science.",
    resources: "TrevTutor (Discrete Math playlist), MIT 6.042J Mathematics for Computer Science."
  },
  "Operating Systems": {
    focus: "CPU Scheduling, Semaphores & Deadlock, Virtual Memory page replacement",
    guide: "Simulate scheduling (Round Robin, SRTF) using timeline diagrams. Study Bankers Algorithm for deadlock avoidance.",
    resources: "Galvin Textbook (Operating System Concepts), NPTEL OS Course by Prof. Santanu Chattopadhyay."
  },
  "Computer Org & Architecture": {
    focus: "Cache Mapping, Pipelining, Instruction Cycles, Memory Hierarchy",
    guide: "Practice cache hit/miss ratio calculation and pipeline speedup formulas. Visualize instruction execution inside ALU.",
    resources: "Computer System Architecture by M. Morris Mano, Neso Academy."
  },
  "Database Management Systems": {
    focus: "Normal Forms (1NF, 2NF, 3NF, BCNF), SQL Joins, Transaction ACID isolation",
    guide: "Practice normalization problems to resolve redundancy. Write nested SQL subqueries on live terminal. Memorize ACID principles.",
    resources: "W3Schools SQL, database-system-concepts (Silberschatz) book resources."
  },
  "Compiler Design": {
    focus: "LL(1) & LR(1) Parsers, Lexical Analysis, Intermediate Code Gen",
    guide: "Calculate FIRST & FOLLOW sets for grammars. Construct parsing tables. Study DFA state transitions in lexers.",
    resources: "Stanford CS143 Compilers, Gate Smashers lectures."
  }
};

const DEFAULT_GUIDE = {
  focus: "Core concepts, problem-solving methodologies, assignments",
  guide: "Analyze past exam papers. Discuss doubts with course instructor weekly. Dedicate 2 hours of self-study specifically to practice problem sets.",
  resources: "NPTEL Courses, GeeksforGeeks, textbooks recommended in your syllabus."
};

function StudentDashboard({ student, handleLogout, handleOpenSettings, apiKey, showBrutalAlert }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const btechBlocks = student.marks.btech || [];
  const totalSubjects = btechBlocks.reduce((acc, sem) => acc + sem.subjects.length, 0);

  const sortedSemesters = [...btechBlocks].sort((a, b) => a.sem - b.sem);
  const dataset = sortedSemesters.map(block => {
    const sum = block.subjects.reduce((s, sub) => s + sub.score, 0);
    const sgpa = (sum / block.subjects.length) / 10;
    return {
      label: `Sem ${block.sem}`,
      val: Math.round(sgpa * 100) / 100
    };
  });

  const handleTriggerAI = async () => {
    setAiLoading(true);
    if (!apiKey) {
      setTimeout(() => {
        setAiReport(generateLocalRemedialReport(student));
        setAiLoading(false);
      }, 800);
      return;
    }

    try {
      let docText = `Tenth Grade: ${student.marks.tenth.score}% (${student.marks.tenth.board})\n`;
      if (student.timeline.twelfth) {
        docText += `Twelfth Grade: ${student.marks.twelfth.score}% (${student.marks.twelfth.board})\n`;
      }
      if (student.timeline.diploma) {
        docText += `Diploma: ${student.marks.diploma.score}% in ${student.marks.diploma.stream}. Declared weakness: ${student.marks.diploma.weak}\n`;
      }
      docText += `B.Tech Semester Records:\n`;
      student.marks.btech.forEach(s => {
        docText += `- Sem ${s.sem}:\n`;
        s.subjects.forEach(sub => {
          docText += `  * ${sub.name}: ${sub.score}/100\n`;
        });
      });

      const response = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: "You are evalX academic cognitive guidance assistant. Analyze student marks and compile a highly structured, encouraging, and detailed academic remediation report. Identify weak subjects specifically. Highlight key topics they should review, advise actionable study actions, and recommend high quality online resources. Output in clean HTML formatting (h4, p, ul, li, strong) suitable for direct div rendering."
          },
          {
            role: "user",
            content: `Student Academic Profile:\nName: ${student.name}\nBranch: ${student.branch}\nCGPA: ${student.cgpa}\nWeak subjects: ${JSON.stringify(student.weakSubjects)}\nMarks:\n${docText}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1200
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      let html = response.data.choices[0].message.content;
      html = html.replace(/```html/g, "").replace(/```/g, "").trim();
      setAiReport(`
        <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
          <span class="badge badge-success">✨ Verified Nvidia AI Inference</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">Model: Llama 3.1 70B</span>
        </div>
        <div class="ai-report-body">${html}</div>
      `);
    } catch (error) {
      setAiReport(`
        <div class="glass-card" style="border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.05); margin-bottom:1rem;">
          <h4 style="color:var(--color-danger)">⚠️ Nvidia API connection failed</h4>
          <p class="text-secondary mt-1" style="font-size:0.85rem;">
            Failed to connect to Nvidia NIM servers: "${error.message}". Falling back to local engine:
          </p>
        </div>
        ${generateLocalRemedialReport(student)}
      `);
    } finally {
      setAiLoading(false);
    }
  };

  const generateLocalRemedialReport = (st) => {
    if (st.weakSubjects.length === 0) {
      return `
        <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1rem;">
          <span class="badge badge-secondary">🧠 evalX Local Cognitive Module</span>
        </div>
        <h4>Academic Standing Briefing</h4>
        <p class="mt-2">Excellent performance! You have logged <strong>${st.cgpa.toFixed(2)} CGPA</strong> across <strong>${st.marks.btech.length} semesters</strong>. No subjects scored below 50%.</p>
        <h4 class="mt-4">Recommendations:</h4>
        <ul>
          <li>Maintain study pacing. Solve textbook reference problems.</li>
          <li>Participate in technical hackathons or coding cohorts.</li>
          <li>Outline final year project ideas early.</li>
        </ul>
      `;
    }

    let guidesHtml = "";
    st.weakSubjects.forEach(weak => {
      const guideObj = REMEDIAL_GUIDES[weak.name] || DEFAULT_GUIDE;
      guidesHtml += `
        <div class="glass-card mb-4" style="border-color: rgba(245, 158, 11, 0.15); background:rgba(0,0,0,0.15); margin-bottom:1rem;">
          <h4 style="color:var(--color-warning);">${weak.name}</h4>
          <p style="font-size:0.85rem; color:#f87171;">Flag: ${weak.reason}</p>
          <div class="mt-3">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Core Subtopics:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.focus}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Weekly Action Steps:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.guide}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Resource Repositories:</strong>
            <p style="font-size:0.85rem; color:var(--color-secondary);" class="mt-1">${guideObj.resources}</p>
          </div>
        </div>
      `;
    });

    return `
      <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <span class="badge badge-secondary">🧠 evalX Local Cognitive Module</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">Simulated Nvidia Advisor</span>
      </div>
      <h4>Remedial Study Roadmap for ${st.name}</h4>
      <p class="mb-4">The academic analysis engine identified <strong>${st.weakSubjects.length} focus targets</strong> requiring curriculum alignment:</p>
      <div class="remedial-guides-container">${guidesHtml}</div>
    `;
  };

  const width = 700;
  const height = 220;
  const paddingX = 50;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const yLines = [2, 4, 6, 8, 10];
  const points = dataset.map((d, index) => {
    const xRatio = dataset.length > 1 ? index / (dataset.length - 1) : 0.5;
    const xCoord = paddingX + (xRatio * chartW);
    const yRatio = d.val / 10;
    const yCoord = height - paddingY - (yRatio * chartH);
    return { x: xCoord, y: yCoord, raw: d };
  });

  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    areaD = `M ${points[0].x} ${height - paddingY} L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp2x = prev.x + 2 * (curr.x - prev.x) / 3;
      pathD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
      areaD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    areaD += ` L ${points[points.length - 1].x} ${height - paddingY} Z`;
  }

  return (
    <div className="brutal-grid-layout" style={{ marginTop: "1rem" }}>
      <div className="brutal-sidebar">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-pink)", border: "3px solid #000", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 1rem", fontSize: "2rem", justifyContent: "center" }}>🎓</div>
          <h3 id="dash-student-name" style={{ fontSize: "1.3rem", textTransform: "none", marginBottom: "0.25rem" }}>{student.name}</h3>
          <p id="dash-student-reg" style={{ fontSize: "0.75rem", fontFamily: "var(--font-brutal-mono)", color: "var(--text-muted)" }}>REG: {student.regNo}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>📊 Overview</button>
          <button className={`nav-item ${activeTab === "focus" ? "active" : ""}`} onClick={() => setActiveTab("focus")}>🧠 Focus Areas</button>
          <button className={`nav-item ${activeTab === "ai" ? "active" : ""}`} onClick={() => setActiveTab("ai")}>🤖 AI NIM Coach</button>
          <button className="nav-item nav-item-danger" onClick={handleLogout} style={{ marginTop: "1.5rem" }}>🚪 Logout</button>
        </div>
      </div>

      <div className="brutal-content-area">
        {activeTab === "overview" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div>
                <span className="badge badge-primary" id="dash-student-badge">{student.branch} - Group {student.group}</span>
                <h2 id="dash-college-name" style={{ fontSize: "2.2rem", marginTop: "0.5rem", textTransform: "none" }}>{student.college}</h2>
              </div>
            </div>

            <div className="dashboard-card-grid" style={{ marginBottom: "2.5rem" }}>
              <div className="dashboard-metrics-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>B.TECH CGPA</p>
                <p id="dash-cgpa" style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3.2rem", fontWeight: "900", margin: 0 }}>{student.cgpa.toFixed(2)}</p>
              </div>

              <div className="dashboard-metrics-card secondary" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>COURSES EVALUATED</p>
                <p id="dash-total-subjects" style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3.2rem", fontWeight: "900", margin: 0 }}>{totalSubjects}</p>
              </div>

              <div className="dashboard-metrics-card accent" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>NVIDIA AI STATUS</p>
                <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "2.4rem", fontWeight: "900", margin: "0.5rem 0 0 0", textAlign: "center", lineHeight: 1.1 }}>
                  {apiKey ? "ACTIVE" : "OFFLINE"}
                </p>
              </div>
            </div>

            <div className="brutal-alert-strip" id="dashboard-weakness-banner" style={{ marginBottom: "2.5rem", background: student.weakSubjects.length === 0 ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)" : "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)", borderColor: student.weakSubjects.length === 0 ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.2)" }}>
              <div className="brutal-alert-strip-left">{student.weakSubjects.length === 0 ? "🏆" : "⚠️"}</div>
              <div>
                <h4 className="weakness-title" style={{ color: student.weakSubjects.length === 0 ? "var(--color-success)" : "var(--color-warning)", textTransform: "none" }}>
                  {student.weakSubjects.length === 0 ? "Excellent Academic Standing!" : "Focus Target Fields (Weak Subjects Identified)"}
                </h4>
                <p id="weakness-summary-text" style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}>
                  {student.weakSubjects.length === 0 ? "All core subjects average above safety threshold. No immediate structural deficiencies found." : "Specific subject fields have been identified below the safety index threshold of 50%. Focus on these domains."}
                </p>
              </div>
            </div>

            <div className="brutal-subject-grid" id="dash-weak-subjects-container" style={{ marginBottom: "2.5rem" }}>
              {student.weakSubjects.length === 0 ? (
                <div className="glass-card text-center" style={{ gridColumn: "1 / -1", padding: "1.5rem" }}>
                  <span>🏆</span>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem" }}>Keep up the exceptional work!</p>
                </div>
              ) : (
                student.weakSubjects.map((w, idx) => {
                  const guideObj = REMEDIAL_GUIDES[w.name] || DEFAULT_GUIDE;
                  return (
                    <div key={idx} className="weak-subject-card">
                      <div className="weak-subject-name">{w.name}</div>
                      <div className="weak-subject-score">{w.reason}</div>
                      <div className="weak-subject-guide" style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                        <strong>Remedial Target:</strong> {guideObj.focus}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textTransform: "none" }}>Semester SGPA Progression</h3>
              <div className="chart-container" style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", border: "var(--border-width) solid var(--border-brutal)" }}>
                {dataset.length < 2 ? (
                  <div id="sgpa-chart-placeholder" style={{ height: "220px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "var(--text-muted)" }}>
                    <span style={{ fontSize: "1.5rem" }}>📈</span>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Log at least 2 semesters of grades to render historical trend timelines.</p>
                  </div>
                ) : (
                  <svg id="sgpa-trend-svg" viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "220px", display: "block", overflow: "visible" }}>
                    <g id="chart-grid">
                      {yLines.map((yVal, i) => {
                        const yRatio = yVal / 10;
                        const yCoord = height - paddingY - (yRatio * chartH);
                        return (
                          <g key={i}>
                            <line x1={paddingX} y1={yCoord} x2={width - paddingX} y2={yCoord} className="chart-grid-line" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                            <text x={paddingX - 12} y={yCoord + 4} textAnchor="end" className="chart-axis-text" fill="rgba(255,255,255,0.4)" fontSize="0.75rem" fontWeight="700">
                              {yVal.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                    <path id="chart-area-path" d={areaD} fill="var(--color-blue)" opacity="0.15" />
                    <path id="chart-line-path" d={pathD} fill="none" stroke="var(--color-yellow)" strokeWidth="4" />
                    <g id="chart-dots">
                      {points.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="6" className="chart-dot" fill="var(--color-yellow)" stroke="#000" strokeWidth="2.5" onClick={() => showBrutalAlert(`${pt.raw.label} SGPA: ${pt.raw.val}`)} style={{ cursor: "pointer" }} />
                      ))}
                    </g>
                    <g id="chart-labels">
                      {points.map((pt, i) => (
                        <g key={i}>
                          <text x={pt.x} y={height - 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="0.75rem" fontWeight="700">
                            {pt.raw.label}
                          </text>
                          <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="#fff" fontSize="0.75rem" fontWeight="600">
                            {pt.raw.val.toFixed(2)}
                          </text>
                        </g>
                      ))}
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "focus" && (
          <div className="dashboard-panel">
            <h3 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", textTransform: "none" }}>Curricular Weaknesses & Study Manuals</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} id="full-weak-list">
              {student.weakSubjects.length === 0 ? (
                <div className="glass-card text-center" style={{ padding: "3rem 1rem" }}>
                  <h3>Zero Course Deficiencies Found</h3>
                  <p className="text-secondary mt-2">All registered subjects meet or exceed the performance targets.</p>
                </div>
              ) : (
                student.weakSubjects.map((weak, idx) => {
                  const guideObj = REMEDIAL_GUIDES[weak.name] || DEFAULT_GUIDE;
                  return (
                    <div key={idx} className="glass-card" style={{ borderLeft: "4px solid var(--color-warning)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h4>{weak.name}</h4>
                        <span className="badge badge-warning">{weak.reason}</span>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-secondary)" }}>Focus Subtopics:</p>
                        <p style={{ fontSize: "0.95rem", color: "#000" }}>{guideObj.focus}</p>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-secondary)" }}>Study Strategy:</p>
                        <p style={{ fontSize: "0.95rem", color: "#000" }}>{guideObj.guide}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-secondary)" }}>Suggested Resources:</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>📚 {guideObj.resources}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.75rem", textTransform: "none", margin: 0 }}>Nvidia Llama AI Guidance Coach</h3>
              <button className="brutal-btn brutal-btn-accent" onClick={handleOpenSettings} style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}>Config NIM API Key</button>
            </div>

            <div className="ai-response-box" style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "2rem", background: "#fff", boxShadow: "4px 4px 0 #000", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {!aiReport && !aiLoading && (
                <div className="text-center" id="ai-prompt-box" style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "3rem" }}>🤖</span>
                  <h4 style={{ margin: "1rem 0 0.5rem", fontSize: "1.2rem", textTransform: "none" }}>Query Nvidia NIM Cloud Inference</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                    Feed your scholastic profile ledger through a 70B parameter Meta Llama model to compile customized study questions and resource playlists.
                  </p>
                  <button className="brutal-btn brutal-btn-dark" onClick={handleTriggerAI}>Generate Cognitive Guidance Plan</button>
                </div>
              )}

              {aiLoading && (
                <div className="text-center" id="ai-loading" style={{ textAlign: "center" }}>
                  <div className="brutal-spinner"></div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "1rem" }}>Querying cloud model API for scholastic guidance...</p>
                </div>
              )}

              {aiReport && !aiLoading && (
                <div id="ai-result-content" dangerouslySetInnerHTML={{ __html: aiReport }} style={{ fontSize: "0.9rem", lineHeight: 1.6 }} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
