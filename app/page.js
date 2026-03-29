"use client";
import React, { useState, useRef } from "react";
import BASE_URL from "./config/api"; 

export default function VideoVault() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); 
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const abortControllerRef = useRef(null);
  const isPausedRef = useRef(false); // লুপের ভেতরে লেটেস্ট স্টেট পাওয়ার জন্য

  // এনালাইসিস ফাংশন
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setVideoData(null);
    try {
      const response = await fetch(`${BASE_URL}/api/get-video-info/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error("Could not fetch video details.");
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError("Invalid URL or Server Error. Please check the link.");
    } finally {
      setLoading(false);
    }
  };

  // পজ এবং রেজ্যুম টগল করার ফাংশন
  const togglePause = () => {
    const newState = !isPaused;
    setIsPaused(newState);
    isPausedRef.current = newState;
  };

  // ডাউনলোড ফাংশন
  const handleDownload = async (formatId) => {
    setStatus("downloading");
    setIsPaused(false);
    isPausedRef.current = false;
    setProgress(0);
    setTimeLeft("Calculating...");
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      const downloadUrl = `${BASE_URL}/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
      const response = await fetch(downloadUrl, { 
        signal: abortControllerRef.current.signal 
      });

      if (!response.ok) throw new Error("Download failed");
      if (!response.body) return;

      const reader = response.body.getReader();
      const contentLengthHeader = response.headers.get("Content-Length");
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader) : 0;
      
      let receivedLength = 0;
      let chunks = [];

      // রিয়েল-টাইম স্ট্রিমিং লুপ
      while (true) {
        // যদি ইউজার পজ ক্লিক করে তবে লুপ এখানে ওয়েট করবে
        if (isPausedRef.current) {
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }

        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength) {
          const currentProgress = Math.round((receivedLength / contentLength) * 100);
          setProgress(currentProgress);
          
          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = receivedLength / elapsedTime;
          const remainingBytes = contentLength - receivedLength;
          const remainingTime = Math.round(remainingBytes / speed);
          
          setTimeLeft(remainingTime > 60 ? `${Math.ceil(remainingTime/60)}m` : `${remainingTime}s`);
        }
      }

      // ফাইল সেভ করা
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileUrl;
      const safeTitle = videoData?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'video';
      a.download = `${safeTitle}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(fileUrl);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Download cancelled");
      } else {
        setError("Download failed. Please try again.");
      }
      setStatus("idle");
    }
  };

  const cancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus("idle");
  };

  return (
    <div style={styles.wrapper}>
      {/* প্রন্তত প্রগ্রেস ফ্লোটিং বক্স */}
      {(status === "downloading" || status === "success") && (
        <div style={styles.floatingBox}>
          <div style={styles.pCard}>
            {status !== "success" ? (
              <>
                <div style={styles.pHeader}>
                  <span style={{fontWeight:'600'}}>⚡ {isPaused ? "Paused" : "Downloading..."}</span>
                  <span style={{color:'#00d2ff'}}>{progress}%</span>
                </div>
                <div style={styles.pBarBg}>
                  <div style={{...styles.pBarFill, width: `${progress}%`, background: isPaused ? '#475569' : 'linear-gradient(90deg, #00d2ff, #3b82f6)'}}></div>
                </div>
                <div style={styles.pFooter}>
                  <span>Remaining: {timeLeft}</span>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button onClick={togglePause} style={styles.pauseBtn}>
                      {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </button>
                    <button onClick={cancelDownload} style={styles.cancelBtn}>✕ Cancel</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{textAlign:'center', color:'#05c46b', fontWeight:'bold'}}>✅ Download Completed!</div>
            )}
          </div>
        </div>
      )}

      <div style={styles.container}>
        <header style={{marginBottom:'40px'}}>
          <h1 style={styles.logo}>Video<span style={{ color: "#00d2ff" }}>Vault</span></h1>
          <p style={styles.tagline}>The ultimate high-speed video downloader for creators.</p>
          <p style={styles.description}>
            Securely download videos from YouTube in high resolution. 
            Powered by Django & Shortfy.xyz technology.
          </p>
        </header>

        <form onSubmit={handleAnalyze} style={styles.searchBox}>
          <input 
            style={styles.input} 
            placeholder="Paste your video link here..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" style={styles.btnAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && <p style={{color:'#ef4444', marginTop:'20px'}}>{error}</p>}

        {videoData && (
          <div style={styles.resultCard}>
            <div style={styles.videoInfo}>
              <img src={videoData.thumbnail} style={styles.thumb} alt="thumbnail" />
              <div style={{flex:1}}>
                <h3 style={styles.vTitle}>{videoData.title}</h3>
                <div style={styles.grid}>
                  {videoData.formats.map((f, i) => (
                    <button key={i} onClick={() => handleDownload(f.format_id)} style={styles.qBtn}>
                      {f.quality} <span style={{fontSize:'10px', marginLeft:'5px', color:'#00d2ff'}}>{f.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <p>© 2026 VideoVault - Powered by <a href="https://shortfy.xyz" target="_blank" style={styles.link}>Shortfy.xyz</a></p>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#050a18", color: "#fff", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: '20px' },
  container: { width: "100%", maxWidth: "850px", textAlign: "center" },
  logo: { fontSize: "3.5rem", fontWeight: "900", marginBottom: '10px', letterSpacing:'-2px' },
  tagline: { color: "#00d2ff", fontSize: "1.2rem", fontWeight: "500", marginBottom: "10px" },
  description: { color: "#94a3b8", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" },
  searchBox: { display: "flex", background: "rgba(30, 41, 59, 0.7)", padding: "8px", borderRadius: "18px", border: "1px solid #334155", backdropFilter: 'blur(10px)', marginTop:'30px' },
  input: { flex: 1, background: "transparent", border: "none", padding: "15px", color: "#fff", outline: "none", fontSize:'1rem' },
  btnAnalyze: { background: "#00d2ff", color: "#050a18", border: "none", padding: "0 30px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
  resultCard: { marginTop: "40px", background: "rgba(255, 255, 255, 0.02)", padding: "25px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign:'left' },
  videoInfo: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
  thumb: { width: '220px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  vTitle: { fontSize: '1.2rem', marginBottom: '20px', fontWeight:'600' },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  qBtn: { padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' },
  floatingBox: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, width: '90%', maxWidth: '420px' },
  pCard: { background: '#0f172a', padding: '30px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)', border: '1px solid #1e293b' },
  pHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize:'15px' },
  pBarBg: { width: '100%', height: '10px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' },
  pBarFill: { height: '100%', transition: 'width 0.4s ease' },
  pFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', color: '#94a3b8', alignItems: 'center' },
  pauseBtn: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #334155', color: '#fff', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  cancelBtn: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  footer: { marginTop: "60px", fontSize: "13px", color: "#475569", textAlign:'center' },
  link: { color: "#00d2ff", textDecoration: "none", fontWeight: "600" }
};