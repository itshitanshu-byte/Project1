import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import collaborativeLearning from "../assets/collaborative_learning.png";

gsap.registerPlugin(ScrollTrigger);

function Home({ navigateTo, handleOpenSettings, apiKey }) {
  const revealRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    if (heroTitleRef.current) {
      heroTl.fromTo(
        heroTitleRef.current,
        { opacity: 0, filter: "blur(18px)", y: 30 },
        { opacity: 1, filter: "blur(0px)", y: 0, delay: 0.3 }
      );
    }
    if (heroSubRef.current) {
      heroTl.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0 },
        "-=0.6"
      );
    }
    if (heroBtnRef.current) {
      heroTl.fromTo(
        heroBtnRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0 },
        "-=0.5"
      );
    }
    if (mockupRef.current) {
      heroTl.fromTo(
        mockupRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "back.out(1.1)" },
        "-=0.8"
      );
    }

    const textEl = revealRef.current;
    if (textEl) {
      const chars = textEl.querySelectorAll(".reveal-char");
      if (chars.length > 0) {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".scroll-reveal-section",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.5
          }
        }).to(chars, {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.02,
          ease: "none"
        });
      }
    }

    const handleMouseMove = (e) => {
      if (!mockupRef.current) return;
      const rect = mockupRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(mockupRef.current, {
        x: x * 0.08,
        y: y * 0.08,
        rotationY: x * 0.03,
        rotationX: -y * 0.03,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (!mockupRef.current) return;
      gsap.to(mockupRef.current, {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const mockupEl = mockupRef.current;
    if (mockupEl) {
      mockupEl.addEventListener("mousemove", handleMouseMove);
      mockupEl.addEventListener("mouseleave", handleMouseLeave);
    }

    const blurTargets = document.querySelectorAll(
      ".bento-card-verify h2, .bento-card-together h2, .bento-card-join .join-title, .portal-split-box h2, .scroll-reveal-section, .feature-cell h3"
    );

    blurTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.filter = "blur(14px)";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.8s ease, filter 0.8s ease, transform 0.8s ease";
    });

    const blurObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.filter = "blur(0px)";
            entry.target.style.transform = "translateY(0)";
            blurObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    blurTargets.forEach((el) => blurObserver.observe(el));

    return () => {
      if (mockupEl) {
        mockupEl.removeEventListener("mousemove", handleMouseMove);
        mockupEl.removeEventListener("mouseleave", handleMouseLeave);
      }
      blurObserver.disconnect();
    };
  }, []);

  const revealText = "DON'T JUST TRUST. VERIFY. ENFORCE INTELLECTUAL INTEGRITY ACROSS COHORTS.";

  return (
    <main id="page-home" className="page active">
      <div className="hero-grid">
        <div className="hero-panel-left">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.2rem" }}>👩‍🎓</span>
            <span className="mono-tag" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              // COGNITIVE ACADEMIC RUNTIME
            </span>
          </div>

          <div className="hero-title-wrap">
            <h1 ref={heroTitleRef} className="hero-h1 font-brutal-display" style={{ textTransform: "none" }}>
              Engineering a<br />
              new{" "}
              <span style={{ background: "var(--color-green)", padding: "0 0.4rem", border: "2.5px solid #000", borderRadius: "10px" }}>
                academic
              </span>
              <br />
              paradigm
            </h1>
          </div>

          <p ref={heroSubRef} className="hero-sub">
            evalX is a diagnostics tracker built for CV Raman Global University. Log prior qualifications, document semester-wise subjects, and utilize Nvidia Llama 3 cloud AI guidance.
          </p>

          <div ref={heroBtnRef} className="mt-6 flex-align gap-4" style={{ marginTop: "2rem", display: "flex" }}>
            <button className="brutal-btn brutal-btn-dark" onClick={() => navigateTo("#student-form")} style={{ padding: "0.9rem 1.8rem" }}>
              Initiate Diagnostics →
            </button>
            <a
              href="#teacher-signup"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("#teacher-signup");
              }}
              className="brutal-btn"
              style={{ padding: "0.9rem 1.8rem", background: "#fff" }}
            >
              Faculty Sign Up
            </a>
          </div>
        </div>

        <div className="hero-panel-right">
          <div className="scalloped-badge-container" onClick={() => navigateTo("#student-form")}>
            <svg viewBox="0 0 100 100" className="scalloped-badge-svg">
              <defs>
                <path id="topArch" d="M 22, 50 A 28,28 0 0,1 78, 50" fill="none" />
              </defs>
              <path
                transform="translate(3, 3)"
                d="M 41.20,17.16 Q 50.00,8.00 58.80,17.16 Q 71.00,13.63 74.04,25.96 Q 86.37,29.00 82.84,41.20 Q 92.00,50.00 82.84,58.80 Q 86.37,71.00 74.04,74.04 Q 71.00,86.37 58.80,82.84 Q 50.00,92.00 41.20,82.84 Q 29.00,86.37 25.96,74.04 Q 13.63,71.00 17.16,58.80 Q 8.00,50.00 17.16,41.20 Q 13.63,29.00 25.96,25.96 Q 29.00,13.63 41.20,17.16 Z"
                fill="black"
              />
              <path
                d="M 41.20,17.16 Q 50.00,8.00 58.80,17.16 Q 71.00,13.63 74.04,25.96 Q 86.37,29.00 82.84,41.20 Q 92.00,50.00 82.84,58.80 Q 86.37,71.00 74.04,74.04 Q 71.00,86.37 58.80,82.84 Q 50.00,92.00 41.20,82.84 Q 29.00,86.37 25.96,74.04 Q 13.63,71.00 17.16,58.80 Q 8.00,50.00 17.16,41.20 Q 13.63,29.00 25.96,25.96 Q 29.00,13.63 41.20,17.16 Z"
                fill="var(--color-yellow)"
                stroke="black"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <text fontFamily="var(--font-brutal-mono)" fontSize="8.5" fontWeight="900" fill="black" letterSpacing="2">
                <textPath href="#topArch" startOffset="50%" textAnchor="middle">
                  GET STARTED
                </textPath>
              </text>
              <path d="M 42,49 L 58,49 M 52,43 L 58,49 L 52,55" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 30,60 A 22,22 0 0,0 70,60" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          <div ref={mockupRef} className="hero-cutout-frame" style={{ border: "none", boxShadow: "none", background: "transparent" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
              <defs>
                <clipPath id="heroClip">
                  <path d="M 25,5 C 45,-5 75,-2 88,15 C 100,32 102,62 90,80 C 78,98 48,102 28,90 C 8,78 -2,48 10,25 C 15,15 20,8 25,5 Z" />
                </clipPath>
              </defs>
              <path
                transform="translate(3, 3)"
                d="M 25,5 C 45,-5 75,-2 88,15 C 100,32 102,62 90,80 C 78,98 48,102 28,90 C 8,78 -2,48 10,25 C 15,15 20,8 25,5 Z"
                fill="black"
              />
              <path
                d="M 25,5 C 45,-5 75,-2 88,15 C 100,32 102,62 90,80 C 78,98 48,102 28,90 C 8,78 -2,48 10,25 C 15,15 20,8 25,5 Z"
                fill="var(--color-yellow)"
                stroke="black"
                strokeWidth="2.5"
              />
              <g clipPath="url(#heroClip)" transform="scale(0.95) translate(2.5, 2.5)">
                <image href={collaborativeLearning} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </g>
              <path
                d="M 25,5 C 45,-5 75,-2 88,15 C 100,32 102,62 90,80 C 78,98 48,102 28,90 C 8,78 -2,48 10,25 C 15,15 20,8 25,5 Z"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item">COGNITIVE ACADEMIC RUNTIME FOR CV RAMAN GLOBAL UNIVERSITY ✦ </div>
          <div className="ticker-item">COGNITIVE ACADEMIC RUNTIME FOR CV RAMAN GLOBAL UNIVERSITY ✦ </div>
          <div className="ticker-item">COGNITIVE ACADEMIC RUNTIME FOR CV RAMAN GLOBAL UNIVERSITY ✦ </div>
        </div>
      </div>

      <section className="feature-section">
        <div className="feature-cell yellow">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💡</div>
          <div>
            <h3 style={{ textTransform: "none", marginTop: "0.5rem" }}>Academic Logging</h3>
            <p className="mt-2" style={{ marginBottom: "1.5rem" }}>
              Document prior school marks and enter B.Tech subjects to calculate CGPA and display SGPA timeline metrics.
            </p>
            <button className="brutal-btn brutal-btn-dark btn-sm-brutal" onClick={() => navigateTo("#student-form")} style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
              Learn More →
            </button>
          </div>
        </div>

        <div className="feature-cell green">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤖</div>
          <div>
            <h3 style={{ textTransform: "none", marginTop: "0.5rem" }}>Nvidia AI Guidance</h3>
            <p className="mt-2" style={{ marginBottom: "1.5rem" }}>
              Run grade records through Nvidia NIM cloud models to parse subject deficiencies and synthesize study recommendations.
            </p>
            <button className="brutal-btn brutal-btn-dark btn-sm-brutal" onClick={() => navigateTo("#student-form")} style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
              Learn More →
            </button>
          </div>
        </div>

        <div className="feature-cell pink">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👨‍🏫</div>
          <div>
            <h3 style={{ textTransform: "none", marginTop: "0.5rem" }}>Faculty Portal</h3>
            <p className="mt-2" style={{ marginBottom: "1.5rem" }}>
              Educators inspect student directories, modify cohort target capacities, and study domain gaps within their groups.
            </p>
            <button className="brutal-btn brutal-btn-dark btn-sm-brutal" onClick={() => navigateTo("#teacher-signup")} style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
              Learn More →
            </button>
          </div>
        </div>
      </section>

      <section className="bento-card-verify">
        <div className="verify-left">
          <h2 style={{ fontSize: "3rem", lineHeight: 1.05, marginBottom: "1rem", textTransform: "none" }}>
            Don't just
            <br />
            trust. Verify.
          </h2>
          <p style={{ color: "var(--text-secondary)", fill: "var(--text-secondary)", maxWidth: "440px", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Rigorous academic grade verification, weighted SGPA algorithms, and verifiable transcript analytics for CV Raman Global University.
          </p>
          <button className="brutal-btn" onClick={() => navigateTo("#student-form")} style={{ background: "#fff", borderRadius: "9999px", padding: "0.8rem 1.6rem" }}>
            LEARN MORE
          </button>
        </div>
        <div className="verify-right">
          <div className="arch-cutout-frame" style={{ border: "none", boxShadow: "none", background: "transparent" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
              <defs>
                <clipPath id="archClip">
                  <path d="M 5,95 L 5,35 C 5,15 25,5 50,5 C 75,5 95,15 95,35 L 95,95 Z" />
                </clipPath>
              </defs>
              <path transform="translate(3, 3)" d="M 5,95 L 5,35 C 5,15 25,5 50,5 C 75,5 95,15 95,35 L 95,95 Z" fill="black" />
              <path d="M 5,95 L 5,35 C 5,15 25,5 50,5 C 75,5 95,15 95,35 L 95,95 Z" fill="var(--color-pink)" stroke="black" strokeWidth="2.5" />
              <g clipPath="url(#archClip)" transform="scale(0.95) translate(2.5, 2.5)">
                <image href={collaborativeLearning} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </g>
              <path d="M 5,95 L 5,35 C 5,15 25,5 50,5 C 75,5 95,15 95,35 L 95,95 Z" fill="none" stroke="black" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </section>

      <section className="scroll-reveal-section">
        <div ref={revealRef} className="reveal-text-container">
          <h2 className="reveal-text">
            {revealText.split("").map((char, index) => {
              if (char === " ") return " ";
              return (
                <span key={index} className="reveal-char">
                  {char}
                </span>
              );
            })}
          </h2>
        </div>
      </section>

      <section className="portal-split-wrap">
        <div className="portal-split-box pink" onClick={() => navigateTo("#student-form")}>
          <span className="mono-tag" style={{ fontSize: "0.75rem" }}>
            [01] // STUDENT DIAGNOSTICS
          </span>
          <div>
            <h2 style={{ fontSize: "2.2rem", marginTop: "1.5rem", marginBottom: "0.75rem", textTransform: "none" }}>Student Diagnostic Engine</h2>
            <p style={{ maxWidth: "420px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Instant CGPA calculations, multi-qualification history tracking (10th / 12th / ITI / Diploma), and semester breakdowns.
            </p>
            <button className="brutal-btn brutal-btn-dark btn-sm-brutal" style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
              Learn More →
            </button>
          </div>
        </div>

        <div className="portal-split-box blue" onClick={() => navigateTo("#teacher-signup")}>
          <span className="mono-tag" style={{ fontSize: "0.75rem" }}>
            [02] // FACULTY OVERSIGHT
          </span>
          <div>
            <h2 style={{ fontSize: "2.2rem", marginTop: "1.5rem", marginBottom: "0.75rem", textTransform: "none" }}>Cohort Analytics Desk</h2>
            <p style={{ maxWidth: "420px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Market-leading cohort oversight tools offering group limit configurations, student lookup tables, and domain reports.
            </p>
            <button className="brutal-btn brutal-btn-dark btn-sm-brutal" style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
              Learn More →
            </button>
          </div>
        </div>
      </section>

      <section className="bento-card-together">
        <div className="together-left">
          <h2 style={{ fontSize: "2.8rem", lineHeight: 1.1, marginBottom: "1rem", textTransform: "none" }}>
            Working together
            <br />
            toward an intelligent campus
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "460px", marginBottom: "2rem", fontSize: "0.95rem" }}>
            We believe AI-assisted academic guidance will empower every student to bridge knowledge voids, understand subject deficiencies, and excel.
          </p>
          <button className="brutal-btn" onClick={() => navigateTo("#student-form")} style={{ background: "#fff", borderRadius: "9999px", padding: "0.8rem 1.6rem" }}>
            ABOUT US
          </button>
        </div>
        <div className="together-right">
          <div className="organic-cutout-frame" style={{ border: "none", boxShadow: "none", background: "transparent" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
              <defs>
                <clipPath id="organicClip">
                  <path d="M 50,5 C 75,5 95,20 95,35 C 95,50 80,50 70,50 C 80,50 95,50 95,65 C 95,80 75,95 50,95 C 25,95 5,80 5,65 C 5,50 20,50 30,50 C 20,50 5,50 5,35 C 5,20 25,5 50,5 Z" />
                </clipPath>
              </defs>
              <path
                transform="translate(3, 3)"
                d="M 50,5 C 75,5 95,20 95,35 C 95,50 80,50 70,50 C 80,50 95,50 95,65 C 95,80 75,95 50,95 C 25,95 5,80 5,65 C 5,50 20,50 30,50 C 20,50 5,50 5,35 C 5,20 25,5 50,5 Z"
                fill="black"
              />
              <path
                d="M 50,5 C 75,5 95,20 95,35 C 95,50 80,50 70,50 C 80,50 95,50 95,65 C 95,80 75,95 50,95 C 25,95 5,80 5,65 C 5,50 20,50 30,50 C 20,50 5,50 5,35 C 5,20 25,5 50,5 Z"
                fill="var(--color-blue)"
                stroke="black"
                strokeWidth="2.5"
              />
              <g clipPath="url(#organicClip)" transform="scale(0.95) translate(2.5, 2.5)">
                <image href={collaborativeLearning} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </g>
              <path
                d="M 50,5 C 75,5 95,20 95,35 C 95,50 80,50 70,50 C 80,50 95,50 95,65 C 95,80 75,95 50,95 C 25,95 5,80 5,65 C 5,50 20,50 30,50 C 20,50 5,50 5,35 C 5,20 25,5 50,5 Z"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="bento-card-join">
        <svg className="join-graphic-web" viewBox="0 0 200 200">
          <path d="M 0,200 L 200,200 M 0,200 L 0,0 M 0,200 L 200,0 M 0,200 L 140,0 M 0,200 L 0,140" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 40,200 A 160,160 0 0,1 200,40" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 80,200 A 120,120 0 0,1 200,80" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 120,200 A 80,80 0 0,1 200,120" stroke="black" strokeWidth="2" fill="none" />
        </svg>

        <div className="join-content">
          <div className="join-badge">✦ AI Academic Intelligence</div>
          <h2 className="join-title">Turn Marks Into Meaning.</h2>
          <p className="join-desc">
            Track semester performance, discover weak subjects, receive AI-powered academic guidance, and help faculty support every student with data-driven insights.
          </p>
          <button
            className="brutal-btn"
            onClick={() => navigateTo("#student-form")}
            style={{ background: "var(--color-yellow)", padding: ".9rem 2.4rem", fontSize: ".95rem", borderRadius: "9999px", boxShadow: "4px 4px 0 #000" }}
          >
            START YOUR ANALYSIS →
          </button>

          <div className="join-stats">
            <div className="join-stat">
              <h3>8+</h3>
              <span>Branches</span>
            </div>
            <div className="join-stat">
              <h3>10</h3>
              <span>Student Groups</span>
            </div>
            <div className="join-stat">
              <h3>AI</h3>
              <span>Performance Insights</span>
            </div>
          </div>
        </div>
        <div className="join-ghost">evalX</div>
      </section>
    </main>
  );
}

export default Home;
