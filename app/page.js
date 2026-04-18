"use client";
import React, { useState, useRef } from "react";

const BASE_URL = "https://video-downloader-backend-8.onrender.com";

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
  const isPausedRef = useRef(false);

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
      setError("Invalid URL or Server restricted. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formatId) => {
    setStatus("downloading");
    setIsPaused(false);
    isPausedRef.current = false;
    setProgress(0);
    setTimeLeft("Connecting...");
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      const downloadUrl = `${BASE_URL}/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
      const response = await fetch(downloadUrl, { signal: abortControllerRef.current.signal });

      if (!response.ok) throw new Error("Download failed");
      
      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = response.body.getReader();
      
      let receivedLength = 0;
      const chunks = []; 

      while(true) {
        if (isPausedRef.current) {
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        const {done, value} = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total) {
          const p = Math.round((receivedLength / total) * 100);
          setProgress(p);
          const duration = (Date.now() - startTime) / 1000;
          const speed = receivedLength / duration;
          const remain = Math.round((total - receivedLength) / speed);
          setTimeLeft(remain > 60 ? `${Math.ceil(remain/60)}m` : `${remain}s`);
        }
      }

      const blob = new Blob(chunks, { type: "video/mp4" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      if (err.name !== 'AbortError') setError("Download failed. YouTube might be blocking the server.");
      setStatus("idle");
    }
  };

  const cancelDownload = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setStatus("idle");
  };

  return (
    <div style={styles.wrapper}>
      {/* Progress UI */}
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
                  <div style={{...styles.pBarFill, width: `${progress}%`}}></div>
                </div>
                <div style={styles.pFooter}>
                  <span>ETA: {timeLeft}</span>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button onClick={() => { setIsPaused(!isPaused); isPausedRef.current = !isPaused; }} style={styles.pauseBtn}>
                      {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </button>
                    <button onClick={cancelDownload} style={styles.cancelBtn}>✕ Cancel</button>
                  </div>
                </div>
              </>
            ) : <div style={{textAlign:'center', color:'#05c46b', fontWeight:'bold'}}>✅ Download Completed!</div>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.logo}>Video<span style={{ color: "#00d2ff" }}>Voult</span></h1>
        <form onSubmit={handleAnalyze} style={styles.searchBox}>
          <input style={styles.input} placeholder="Paste your video link..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit" style={styles.btnAnalyze}>{loading ? "Analyzing..." : "Analyze"}</button>
        </form>

        {error && <p style={{color:'#ef4444', marginTop:'20px'}}>{error}</p>}

        {videoData && (
          <div style={styles.resultCard}>
            <img src={videoData.thumbnail} style={styles.thumb} alt="thumb" />
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
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#050a18", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: '40px 20px' },
  container: { width: "100%", maxWidth: "700px" },
  logo: { fontSize: "3rem", fontWeight: "900", textAlign: 'center' },
  searchBox: { display: "flex", background: "rgba(30, 41, 59, 0.7)", padding: "8px", borderRadius: "18px", marginTop:'30px', border: "1px solid #334155" },
  input: { flex: 1, background: "transparent", border: "none", padding: "15px", color: "#fff", outline: "none" },
  btnAnalyze: { background: "#00d2ff", border: "none", padding: "0 30px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
  resultCard: { marginTop: "40px", background: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "20px", display: 'flex', gap: '20px' },
  thumb: { width: '150px', borderRadius: '12px' },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: '10px' },
  qBtn: { padding: '10px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' },
  floatingBox: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', zIndex: 1000 },
  pCard: { background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #334155' },
  pBarBg: { width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', margin: '10px 0' },
  pBarFill: { height: '100%', background: 'linear-gradient(90deg, #00d2ff, #3b82f6)', borderRadius: '4px', transition: 'width 0.3s' },
  pHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  pFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  pauseBtn: { background: 'none', border: '1px solid #475569', color: '#fff', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }
};