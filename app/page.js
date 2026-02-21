// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   // নতুন স্টেট প্রগ্রেস বার এর জন্য
//   const [progress, setProgress] = useState(0); 
//   const [status, setStatus] = useState("idle"); // 'idle', 'downloading', 'success'

//   const handleAnalyze = async () => {
//     if (!url) return;
//     setLoading(true);
//     setVideo(null);
//     setStatus("idle");
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/download/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });
//       const data = await res.json();
//       setVideo(data);
//     } catch (err) { alert("Analysis failed!"); }
//     finally { setLoading(false); }
//   };

//   // ইন-সাইট ডাউনলোড ফাংশন (প্রগ্রেস বার সহ)
//   const downloadWithProgress = async (formatId) => {
//     setStatus("downloading");
//     setProgress(0);

//     try {
//       const downloadUrl = `http://127.0.0.1:8000/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
//       const response = await fetch(downloadUrl);

//       if (!response.ok) throw new Error("Download failed");

//       // ডাউনলোড প্রগ্রেস ট্র্যাক করার জন্য Reader ব্যবহার
//       const reader = response.body.getReader();
//       const contentLength = response.headers.get("Content-Length");
      
//       let receivedLength = 0;
//       let chunks = []; 

//       while(true) {
//         const {done, value} = await reader.read();
//         if (done) break;

//         chunks.push(value);
//         receivedLength += value.length;

//         if (contentLength) {
//           const currentProgress = Math.round((receivedLength / contentLength) * 100);
//           setProgress(currentProgress);
//         }
//       }

//       // সব ডাটা জমা হওয়ার পর ফাইল তৈরি করা
//       const blob = new Blob(chunks);
//       const blobUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = blobUrl;
//       a.download = video.title ? `${video.title}.mp4` : "video.mp4";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
      
//       setStatus("success");
//       // ৪ সেকেন্ড পর সাকসেস মেসেজ সরিয়ে দেয়া
//       setTimeout(() => setStatus("idle"), 4000);
//     } catch (err) {
//       alert("Download error!");
//       setStatus("idle");
//     }
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* নিয়ন প্রগ্রেস টোস্ট */}
//       {status === "downloading" && (
//         <div style={styles.toast}>
//           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
//             <span style={{fontWeight:'bold', fontSize:'14px'}}>⚡ Downloading...</span>
//             <span style={{color:'#00d2ff', fontWeight:'bold'}}>{progress}%</span>
//           </div>
//           <div style={styles.pBarBg}>
//             <div style={{...styles.pBarFill, width: `${progress}%`}}></div>
//           </div>
//         </div>
//       )}

//       {/* সাকসেস মেসেজ */}
//       {status === "success" && (
//         <div style={{...styles.toast, background:'#05c46b', border:'none', textAlign:'center', fontWeight:'bold'}}>
//           ✅ Download Complete!
//         </div>
//       )}

//       <div style={styles.card}>
//         <h1 style={styles.title}>Video<span style={{color:'#00d2ff'}}>Stream</span></h1>
        
//         <div style={styles.searchBox}>
//           <input 
//             style={styles.input} 
//             placeholder="Paste Link Here..." 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button style={styles.btn} onClick={handleAnalyze} disabled={loading}>
//             {loading ? "..." : "Analyze"}
//           </button>
//         </div>

//         {video && (
//           <div style={styles.result}>
//             <img src={video.thumbnail} style={styles.thumb} alt="thumb" />
//             <div style={{flex:1}}>
//               <h3 style={styles.vTitle}>{video.title}</h3>
//               <p style={{fontSize:'12px', color:'#94a3b8', marginBottom:'15px'}}>⬇ Click quality to download inside web</p>
//               <div style={styles.grid}>
//                 {video.formats.map((f, i) => (
//                   <button key={i} style={styles.qBtn} onClick={() => downloadWithProgress(f.format_id)}>
//                     {f.quality}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: { minHeight: '100vh', background: '#050a18', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif', color: '#fff', position: 'relative' },
//   card: { background: '#112240', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' },
//   title: { textAlign: 'center', fontSize: '32px', marginBottom: '30px', fontWeight:'800' },
//   searchBox: { display: 'flex', background: '#1e293b', padding: '5px', borderRadius: '15px', gap: '5px', border: '1px solid #334155' },
//   input: { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none' },
//   btn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
//   result: { marginTop: '30px', display: 'flex', gap: '20px' },
//   thumb: { width: '180px', height: 'auto', borderRadius: '15px', objectFit: 'cover' },
//   vTitle: { fontSize: '18px', marginBottom: '10px', fontWeight:'600' },
//   grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
//   qBtn: { padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  
//   // নিয়ন প্রগ্রেস টোস্ট স্টাইল
//   toast: { 
//     position: 'fixed', top: '20px', right: '20px', background: '#1d2d50', 
//     padding: '20px', borderRadius: '16px', width: '280px', zIndex: 1000,
//     boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)', border: '1px solid #00d2ff' 
//   },
//   pBarBg: { width: '100%', height: '8px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden' },
//   pBarFill: { height: '100%', background: 'linear-gradient(90deg, #00d2ff, #3b82f6)', boxShadow: '0 0 10px #00d2ff', transition: 'width 0.3s ease' }
// };















// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleAnalyze = async () => {
//     if (!url) return;
//     setLoading(true);
//     setVideo(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/download/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });
//       const data = await res.json();
//       setVideo(data);
//     } catch (err) { alert("Analysis failed!"); }
//     finally { setLoading(false); }
//   };

//   // গুগল ক্রোমে ডাউনলোড শুরু করার ফাংশন
//   const triggerNativeDownload = (formatId) => {
//     const downloadUrl = `http://127.0.0.1:8000/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
    
//     // ম্যাজিক লাইন: এটি ব্রাউজারের ডাউনলোড লিস্টে ফাইলটি পাঠিয়ে দিবে
//     window.location.href = downloadUrl;
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Video<span style={{color:'#00d2ff'}}>Stream</span></h1>
        
//         <div style={styles.searchBox}>
//           <input 
//             style={styles.input} 
//             placeholder="Paste Link Here..." 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button style={styles.btn} onClick={handleAnalyze} disabled={loading}>
//             {loading ? "..." : "Analyze"}
//           </button>
//         </div>

//         {video && (
//           <div style={styles.result}>
//             <img src={video.thumbnail} style={styles.thumb} alt="thumb" />
//             <div style={{flex:1}}>
//               <h3 style={styles.vTitle}>{video.title}</h3>
//               <p style={{fontSize:'12px', color:'#94a3b8', marginBottom:'15px'}}>⬇ Click quality to start browser download</p>
//               <div style={styles.grid}>
//                 {video.formats.map((f, i) => (
//                   <button key={i} style={styles.qBtn} onClick={() => triggerNativeDownload(f.format_id)}>
//                     {f.quality}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: { minHeight: '100vh', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif', color: '#fff' },
//   card: { background: '#1e293b', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' },
//   title: { textAlign: 'center', fontSize: '32px', marginBottom: '30px' },
//   searchBox: { display: 'flex', background: '#334155', padding: '5px', borderRadius: '15px', gap: '5px' },
//   input: { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none' },
//   btn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
//   result: { marginTop: '30px', display: 'flex', gap: '20px' },
//   thumb: { width: '180px', borderRadius: '15px' },
//   vTitle: { fontSize: '18px', marginBottom: '10px' },
//   grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
//   qBtn: { padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
// };






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

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setVideoData(null);
    try {
      const response = await fetch(`${BASE_URL}/api/video-info/`, {
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

  const handleDownload = async (formatId) => {
    setStatus("downloading");
    setIsPaused(false);
    setProgress(0);
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      const downloadUrl = `${BASE_URL}/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
      const response = await fetch(downloadUrl, { 
        signal: abortControllerRef.current.signal 
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const contentLengthHeader = response.headers.get("Content-Length");
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader) : 0;
      
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        if (isPaused) {
          await new Promise(resolve => setTimeout(resolve, 1000));
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
          const remainingTime = Math.round((contentLength - receivedLength) / speed);
          setTimeLeft(remainingTime > 60 ? `${Math.ceil(remainingTime/60)}m` : `${remainingTime}s`);
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
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      if (err.name !== 'AbortError') setStatus("idle");
    }
  };

  return (
    <div style={styles.wrapper}>
      {(status === "downloading" || status === "paused" || status === "success") && (
        <div style={styles.floatingBox}>
          <div style={styles.pCard}>
            {status !== "success" ? (
              <>
                <div style={styles.pHeader}>
                  <span style={{fontWeight:'600'}}>⚡ {isPaused ? "Paused" : "Downloading..."}</span>
                  <span style={{color:'#00d2ff'}}>{progress}%</span>
                </div>
                <div style={styles.pBarBg}>
                  <div style={{...styles.pBarFill, width: `${progress}%`, background: isPaused ? '#64748b' : 'linear-gradient(90deg, #00d2ff, #3b82f6)'}}></div>
                </div>
                <div style={styles.pFooter}>
                  <span>Remaining: {timeLeft}</span>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button onClick={() => setIsPaused(!isPaused)} style={styles.pauseBtn}>
                      {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </button>
                    <button onClick={() => setStatus("idle")} style={styles.cancelBtn}>✕</button>
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
            Securely download videos from YouTube, Instagram, Facebook, and TikTok in up to 4K resolution. 
            No ads, no limits, just pure quality.
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
                    <button key={i} onClick={() => handleDownload(f.format_id)} style={styles.qBtn}>
                      {f.quality} <span style={{fontSize:'10px', marginLeft:'5px'}}>DOWNLOAD</span>
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
  pauseBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: '#fff', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer' },
  cancelBtn: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' },
  footer: { marginTop: "60px", fontSize: "13px", color: "#475569", textAlign:'center' },
  link: { color: "#00d2ff", textDecoration: "none", fontWeight: "600" }
};