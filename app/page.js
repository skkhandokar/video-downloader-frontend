




// "use client";
// import React, { useState, useRef } from "react";
// import BASE_URL from "./config/api";
// export default function VideoVault() {
//   const [url, setUrl] = useState("");
//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState("idle"); 
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isPaused, setIsPaused] = useState(false);
  
//   const abortControllerRef = useRef(null);

//   const handleAnalyze = async (e) => {
//     e.preventDefault();
//     if (!url) return;
//     setLoading(true);
//     setError("");
//     setVideoData(null);
//     try {
//       const response = await fetch(`https://skkhandokar21.pythonanywhere.com/api/video-info/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });
//       if (!response.ok) throw new Error("Could not fetch video details.");
//       const data = await response.json();
//       setVideoData(data);
//     } catch (err) {
//       setError("Invalid URL or Server Error. Please check the link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (formatId) => {
//     setStatus("downloading");
//     setIsPaused(false);
//     setProgress(0);
    
//     abortControllerRef.current = new AbortController();
//     const startTime = Date.now();

//     try {
//       const downloadUrl = `https://skkhandokar21.pythonanywhere.com/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
//       const response = await fetch(downloadUrl, { 
//         signal: abortControllerRef.current.signal 
//       });

//       if (!response.body) return;

//       const reader = response.body.getReader();
//       const contentLengthHeader = response.headers.get("Content-Length");
//       const contentLength = contentLengthHeader ? parseInt(contentLengthHeader) : 0;
      
//       let receivedLength = 0;
//       let chunks = [];

//       while (true) {
//         if (isPaused) {
//           await new Promise(resolve => setTimeout(resolve, 1000));
//           continue;
//         }

//         const { done, value } = await reader.read();
//         if (done) break;

//         chunks.push(value);
//         receivedLength += value.length;

//         if (contentLength) {
//           const currentProgress = Math.round((receivedLength / contentLength) * 100);
//           setProgress(currentProgress);
          
//           const elapsedTime = (Date.now() - startTime) / 1000;
//           const speed = receivedLength / elapsedTime;
//           const remainingTime = Math.round((contentLength - receivedLength) / speed);
//           setTimeLeft(remainingTime > 60 ? `${Math.ceil(remainingTime/60)}m` : `${remainingTime}s`);
//         }
//       }

//       const blob = new Blob(chunks);
//       const fileUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = fileUrl;
//       a.download = `${videoData?.title || 'video'}.mp4`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
      
//       setStatus("success");
//       setTimeout(() => setStatus("idle"), 3000);
//     } catch (err) {
//       if (err.name !== 'AbortError') setStatus("idle");
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       {(status === "downloading" || status === "paused" || status === "success") && (
//         <div style={styles.floatingBox}>
//           <div style={styles.pCard}>
//             {status !== "success" ? (
//               <>
//                 <div style={styles.pHeader}>
//                   <span style={{fontWeight:'600'}}>⚡ {isPaused ? "Paused" : "Downloading..."}</span>
//                   <span style={{color:'#00d2ff'}}>{progress}%</span>
//                 </div>
//                 <div style={styles.pBarBg}>
//                   <div style={{...styles.pBarFill, width: `${progress}%`, background: isPaused ? '#64748b' : 'linear-gradient(90deg, #00d2ff, #3b82f6)'}}></div>
//                 </div>
//                 <div style={styles.pFooter}>
//                   <span>Remaining: {timeLeft}</span>
//                   <div style={{display:'flex', gap:'10px'}}>
//                     <button onClick={() => setIsPaused(!isPaused)} style={styles.pauseBtn}>
//                       {isPaused ? "▶ Resume" : "⏸ Pause"}
//                     </button>
//                     <button onClick={() => setStatus("idle")} style={styles.cancelBtn}>✕</button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div style={{textAlign:'center', color:'#05c46b', fontWeight:'bold'}}>✅ Download Completed!</div>
//             )}
//           </div>
//         </div>
//       )}

//       <div style={styles.container}>
//         <header style={{marginBottom:'40px'}}>
//           <h1 style={styles.logo}>Video<span style={{ color: "#00d2ff" }}>Vault</span></h1>
//           <p style={styles.tagline}>The ultimate high-speed video downloader for creators.</p>
//           <p style={styles.description}>
//             Securely download videos from YouTube, Instagram, Facebook, and TikTok in up to 4K resolution. 
//             No ads, no limits, just pure quality.
//           </p>
//         </header>

//         <form onSubmit={handleAnalyze} style={styles.searchBox}>
//           <input 
//             style={styles.input} 
//             placeholder="Paste your video link here..." 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button type="submit" style={styles.btnAnalyze} disabled={loading}>
//             {loading ? "..." : "Analyze"}
//           </button>
//         </form>

//         {videoData && (
//           <div style={styles.resultCard}>
//             <div style={styles.videoInfo}>
//               <img src={videoData.thumbnail} style={styles.thumb} alt="thumbnail" />
//               <div style={{flex:1}}>
//                 <h3 style={styles.vTitle}>{videoData.title}</h3>
//                 <div style={styles.grid}>
//                   {videoData.formats.map((f, i) => (
//                     <button key={i} onClick={() => handleDownload(f.format_id)} style={styles.qBtn}>
//                       {f.quality} <span style={{fontSize:'10px', marginLeft:'5px'}}>DOWNLOAD</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <footer style={styles.footer}>
//         <p>© 2026 VideoVault - Powered by <a href="https://shortfy.xyz" target="_blank" style={styles.link}>Shortfy.xyz</a></p>
//       </footer>
//     </div>
//   );
// }

// const styles = {
//   wrapper: { minHeight: "100vh", backgroundColor: "#050a18", color: "#fff", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: '20px' },
//   container: { width: "100%", maxWidth: "850px", textAlign: "center" },
//   logo: { fontSize: "3.5rem", fontWeight: "900", marginBottom: '10px', letterSpacing:'-2px' },
//   tagline: { color: "#00d2ff", fontSize: "1.2rem", fontWeight: "500", marginBottom: "10px" },
//   description: { color: "#94a3b8", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" },
//   searchBox: { display: "flex", background: "rgba(30, 41, 59, 0.7)", padding: "8px", borderRadius: "18px", border: "1px solid #334155", backdropFilter: 'blur(10px)', marginTop:'30px' },
//   input: { flex: 1, background: "transparent", border: "none", padding: "15px", color: "#fff", outline: "none", fontSize:'1rem' },
//   btnAnalyze: { background: "#00d2ff", color: "#050a18", border: "none", padding: "0 30px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
//   resultCard: { marginTop: "40px", background: "rgba(255, 255, 255, 0.02)", padding: "25px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign:'left' },
//   videoInfo: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
//   thumb: { width: '220px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
//   vTitle: { fontSize: '1.2rem', marginBottom: '20px', fontWeight:'600' },
//   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
//   qBtn: { padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' },
//   floatingBox: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, width: '90%', maxWidth: '420px' },
//   pCard: { background: '#0f172a', padding: '30px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)', border: '1px solid #1e293b' },
//   pHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize:'15px' },
//   pBarBg: { width: '100%', height: '10px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' },
//   pBarFill: { height: '100%', transition: 'width 0.4s ease' },
//   pFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', color: '#94a3b8', alignItems: 'center' },
//   pauseBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: '#fff', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer' },
//   cancelBtn: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' },
//   footer: { marginTop: "60px", fontSize: "13px", color: "#475569", textAlign:'center' },
//   link: { color: "#00d2ff", textDecoration: "none", fontWeight: "600" }
// };











"use client";
import React, { useState, useRef } from "react";

export default function VideoVault() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // 'idle', 'processing', 'downloading', 'success'
  const [timeLeft, setTimeLeft] = useState(null);
  
  const abortControllerRef = useRef(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setVideoData(null);
    try {
      const response = await fetch(`https://skkhandokar21.pythonanywhere.com/api/video-info/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error("Could not fetch video details.");
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError("Invalid URL or Server Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formatId, quality) => {
    // যদি 720p এর চেয়ে বড় হয়, তবে 'processing' স্ট্যাটাস দেখাবে
    const isHQ = parseInt(quality) > 720 || quality.includes('480'); 
    setStatus(isHQ ? "processing" : "downloading");
    
    setProgress(0);
    setTimeLeft(null);
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      const downloadUrl = `https://skkhandokar21.pythonanywhere.com/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
      const response = await fetch(downloadUrl, { 
        signal: abortControllerRef.current.signal 
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const contentLengthHeader = response.headers.get("Content-Length");
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader) : 0;
      
      let receivedLength = 0;
      let chunks = [];

      // ডেটা আসা শুরু হলেই স্ট্যাটাস 'downloading' হয়ে যাবে
      let hasStartedDownloading = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (!hasStartedDownloading) {
          setStatus("downloading");
          hasStartedDownloading = true;
        }

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength) {
          const currentProgress = Math.round((receivedLength / contentLength) * 100);
          setProgress(currentProgress);
          
          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = receivedLength / elapsedTime;
          const remainingTime = Math.round((contentLength - receivedLength) / speed);
          setTimeLeft(remainingTime > 60 ? `${Math.ceil(remainingTime/60)}m` : `${remainingTime}s`);
        } else {
          // যদি Content-Length না থাকে (FFmpeg এর ক্ষেত্রে অনেক সময় থাকে না)
          // তখন আমরা শুধু প্রাপ্ত মেগাবাইট দেখাতে পারি
          setProgress(Math.round(receivedLength / (1024 * 1024))); 
        }
      }

      const blob = new Blob(chunks);
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `${videoData?.title || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileUrl);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      if (err.name !== 'AbortError') setStatus("idle");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* ফ্লোটিং প্রগ্রেস বক্স */}
      {(status !== "idle") && (
        <div style={styles.floatingBox}>
          <div style={styles.pCard}>
            {status === "processing" && (
              <div style={{textAlign:'center'}}>
                <div className="spinner"></div>
                <p style={{marginTop:'15px', fontWeight:'600'}}>⚙️ Merging Audio & Video...</p>
                <p style={{fontSize:'12px', color:'#94a3b8'}}>This might take a minute for 1080p</p>
              </div>
            )}
            
            {status === "downloading" && (
              <>
                <div style={styles.pHeader}>
                  <span style={{fontWeight:'600'}}>⚡ Downloading...</span>
                  <span style={{color:'#00d2ff'}}>{progress}{timeLeft ? '%' : ' MB'}</span>
                </div>
                <div style={styles.pBarBg}>
                  <div style={{...styles.pBarFill, width: timeLeft ? `${progress}%` : '100%', transition: 'width 0.3s ease'}}></div>
                </div>
                <div style={styles.pFooter}>
                  <span>{timeLeft ? `Remaining: ${timeLeft}` : 'Streaming data...'}</span>
                  <button onClick={() => { abortControllerRef.current.abort(); setStatus("idle"); }} style={styles.cancelBtn}>✕ Cancel</button>
                </div>
              </>
            )}

            {status === "success" && (
              <div style={{textAlign:'center', color:'#05c46b', fontWeight:'bold'}}>✅ Download Completed!</div>
            )}
          </div>
        </div>
      )}

      <div style={styles.container}>
        <h1 style={styles.logo}>Video<span style={{ color: "#00d2ff" }}>Vault</span></h1>
        
        <form onSubmit={handleAnalyze} style={styles.searchBox}>
          <input 
            style={styles.input} 
            placeholder="Paste your video link here..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" style={styles.btnAnalyze} disabled={loading}>
            {loading ? "..." : "Analyze"}
          </button>
        </form>

        {videoData && (
          <div style={styles.resultCard}>
            <div style={styles.videoInfo}>
              <img src={videoData.thumbnail} style={styles.thumb} alt="thumbnail" />
              <div style={{flex:1}}>
                <h3 style={styles.vTitle}>{videoData.title}</h3>
                <div style={styles.grid}>
                  {videoData.formats.map((f, i) => (
                    <button key={i} onClick={() => handleDownload(f.format_id, f.quality)} style={styles.qBtn}>
                      {f.quality} 
                      <span style={{fontSize:'10px', display:'block', color:'#00d2ff'}}>
                        {parseInt(f.quality) >= 1080 ? "HIGH QUALITY" : "DIRECT"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 210, 255, 0.1);
          border-left-color: #00d2ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// স্টাইল অবজেক্ট আগের মতোই থাকবে, শুধু pBarFill এ ট্রানজিশন যোগ হয়েছে।
const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#050a18", color: "#fff", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: '20px' },
  container: { width: "100%", maxWidth: "850px", textAlign: "center" },
  logo: { fontSize: "3.5rem", fontWeight: "900", marginBottom: '30px', letterSpacing:'-2px' },
  searchBox: { display: "flex", background: "rgba(30, 41, 59, 0.7)", padding: "8px", borderRadius: "18px", border: "1px solid #334155", backdropFilter: 'blur(10px)', marginTop:'10px' },
  input: { flex: 1, background: "transparent", border: "none", padding: "15px", color: "#fff", outline: "none", fontSize:'1rem' },
  btnAnalyze: { background: "#00d2ff", color: "#050a18", border: "none", padding: "0 30px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
  resultCard: { marginTop: "40px", background: "rgba(255, 255, 255, 0.02)", padding: "25px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign:'left' },
  videoInfo: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
  thumb: { width: '220px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  vTitle: { fontSize: '1.2rem', marginBottom: '20px', fontWeight:'600' },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  qBtn: { padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' },
  floatingBox: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, width: '90%', maxWidth: '400px' },
  pCard: { background: '#0f172a', padding: '30px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)', border: '1px solid #1e293b' },
  pHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  pBarBg: { width: '100%', height: '10px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' },
  pBarFill: { height: '100%', background: 'linear-gradient(90deg, #00d2ff, #3b82f6)' },
  pFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', color: '#94a3b8', alignItems: 'center' },
  cancelBtn: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }
};