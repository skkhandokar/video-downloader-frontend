// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState("idle"); // idle, downloading, success

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

//   const downloadWithProgress = async (formatId) => {
//     setStatus("downloading");
//     setProgress(0);
//     try {
//       const dUrl = `http://127.0.0.1:8000/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
//       const response = await fetch(dUrl);
      
//       const contentLength = response.headers.get("Content-Length");
//       const reader = response.body.getReader();
      
//       let receivedLength = 0;
//       let chunks = [];

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         chunks.push(value);
//         receivedLength += value.length;

//         if (contentLength) {
//           const pct = Math.round((receivedLength / contentLength) * 100);
//           setProgress(pct);
//         }
//       }

//       // ফাইলটি ইউজারের পিসিতে সেভ করা
//       const blob = new Blob(chunks);
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${video.title || 'video'}.mp4`;
//       link.click();
      
//       setStatus("success");
//       setTimeout(() => setStatus("idle"), 4000);
//     } catch (error) {
//       alert("Download failed!");
//       setStatus("idle");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* Background Neon Glows */}
//       <div style={styles.glow1}></div>
//       <div style={styles.glow2}></div>

//       {/* Floating Modern Progress Bar */}
//       {status === "downloading" && (
//         <div style={styles.toast}>
//           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
//             <span style={{fontWeight:'bold'}}>⚡ Downloading...</span>
//             <span style={{color:'#00d2ff'}}>{progress}%</span>
//           </div>
//           <div style={styles.pBarBg}>
//             <div style={{...styles.pBarFill, width: `${progress}%`}}></div>
//           </div>
//         </div>
//       )}

//       {status === "success" && (
//         <div style={{...styles.toast, background:'#05c46b', border:'none'}}>✅ Download Complete!</div>
//       )}

//       <div style={styles.glassCard}>
//         <h1 style={styles.title}>Video<span style={{color:'#00d2ff'}}>Vault</span></h1>
        
//         <div style={styles.inputArea}>
//           <input 
//             style={styles.input} 
//             placeholder="Paste Video Link Here..." 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button style={styles.btn} onClick={handleAnalyze} disabled={loading}>
//             {loading ? "..." : "Analyze"}
//           </button>
//         </div>

//         {video && (
//           <div style={styles.resultBox}>
//             <img src={video.thumbnail} style={styles.thumb} alt="thumb" />
//             <div style={{flex:1}}>
//               <h3 style={styles.vTitle}>{video.title}</h3>
//               <div style={styles.grid}>
//                 {video.formats.map((f, i) => (
//                   <button key={i} style={styles.qBtn} onClick={() => downloadWithProgress(f.format_id)}>
//                     {f.quality} <span style={{fontSize:'10px', opacity:0.6}}>MP4</span>
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
//   page: { minHeight: '100vh', background: '#050a18', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif', color: '#fff', position: 'relative', overflow: 'hidden' },
//   glow1: { position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(0, 210, 255, 0.15)', filter: 'blur(100px)', borderRadius: '50%' },
//   glow2: { position: 'absolute', bottom: '0', right: '0', width: '500px', height: '500px', background: 'rgba(157, 0, 255, 0.1)', filter: 'blur(120px)', borderRadius: '50%' },
//   glassCard: { zIndex: 10, background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '650px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
//   title: { fontSize: '40px', textAlign: 'center', marginBottom: '30px', fontWeight: '900', letterSpacing: '-1px' },
//   inputArea: { display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '18px', gap: '10px', border: '1px solid rgba(255,255,255,0.05)' },
//   input: { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none', fontSize: '16px' },
//   btn: { background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
//   resultBox: { marginTop: '35px', display: 'flex', gap: '20px', animation: 'fadeIn 0.5s' },
//   thumb: { width: '180px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' },
//   vTitle: { fontSize: '18px', marginBottom: '15px', fontWeight: '600', lineHeight: '1.4' },
//   grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
//   qBtn: { padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' },
//   toast: { position: 'fixed', top: '30px', background: '#0f172a', padding: '20px', borderRadius: '20px', width: '320px', border: '1px solid #00d2ff', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
//   pBarBg: { width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' },
//   pBarFill: { height: '100%', background: '#00d2ff', transition: 'width 0.3s ease' }
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
import { useState } from "react";

export default function VideoVault() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setVideoData(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/video-info/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Could not fetch video details.");
      
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError("Invalid URL or Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (formatId) => {
    // এটি সরাসরি গুগল ক্রোমের ডাউনলোড ম্যানেজারে ফাইলটি পাঠিয়ে দিবে
    const downloadUrl = `http://127.0.0.1:8000/api/download-file/?url=${encodeURIComponent(url)}&format_id=${formatId}`;
    window.location.href = downloadUrl;
  };

  return (
    <div style={styles.wrapper}>
      {/* Background Decorative Elements */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.logo}>Video<span style={{ color: "#00d2ff" }}>Vault</span></h1>
          <p style={styles.subtitle}>Download Your Video with Fast</p>
        </header>

        <form onSubmit={handleAnalyze} style={styles.searchBox}>
          <input
            type="text"
            placeholder="Paste YouTube, FB, Instagram, Tiktok link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btnAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && <p style={styles.errorText}>{error}</p>}

        {videoData && (
          <div style={styles.resultCard}>
            <div style={styles.videoInfo}>
              <img 
                src={videoData.thumbnail} 
                alt="Thumbnail" 
                style={styles.thumbnail} 
              />
              <div style={styles.details}>
                <h2 style={styles.videoTitle}>{videoData.title}</h2>
                <p style={styles.infoLabel}>Available Formats:</p>
                
                <div style={styles.formatGrid}>
                  {videoData.formats.map((f, index) => (
                    <button
                      key={index}
                      onClick={() => triggerDownload(f.format_id)}
                      style={styles.downloadBtn}
                    >
                      <span style={styles.qTag}>{f.quality}</span>
                      <span style={styles.dlIcon}>⬇</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <p>© 2026 VideoVault - Powered by Shortfy</p>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#050a18",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px",
    background: "rgba(0, 210, 255, 0.1)", filter: "blur(100px)", borderRadius: "50%",
  },
  blob2: {
    position: "absolute", bottom: "10%", right: "5%", width: "350px", height: "350px",
    background: "rgba(157, 0, 255, 0.1)", filter: "blur(100px)", borderRadius: "50%",
  },
  container: {
    zIndex: 10, width: "100%", maxWidth: "800px", textAlign: "center",
  },
  header: { marginBottom: "40px" },
  logo: { fontSize: "3rem", fontWeight: "900", letterSpacing: "-1px", margin: 0 },
  subtitle: { color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px" },
  searchBox: {
    display: "flex", background: "rgba(255, 255, 255, 0.05)", padding: "10px",
    borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  input: {
    flex: 1, background: "transparent", border: "none", padding: "15px 20px",
    color: "#fff", fontSize: "1rem", outline: "none",
  },
  btnAnalyze: {
    background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
    color: "#fff", border: "none", padding: "0 35px", borderRadius: "15px",
    fontWeight: "bold", cursor: "pointer", transition: "0.3s",
  },
  errorText: { color: "#ff4d4d", marginTop: "20px", fontWeight: "bold" },
  resultCard: {
    marginTop: "40px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "30px",
    padding: "30px", border: "1px solid rgba(255, 255, 255, 0.08)",
    animation: "fadeIn 0.5s ease-in-out", textAlign: "left",
  },
  videoInfo: { display: "flex", gap: "30px", flexWrap: "wrap" },
  thumbnail: { width: "260px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
  details: { flex: 1, minWidth: "250px" },
  videoTitle: { fontSize: "1.4rem", fontWeight: "700", marginBottom: "15px", lineHeight: "1.3" },
  infoLabel: { color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" },
  formatGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" },
  downloadBtn: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 15px", background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px",
    color: "#fff", cursor: "pointer", transition: "0.2s",
  },
  qTag: { fontWeight: "bold", fontSize: "0.9rem" },
  dlIcon: { color: "#00d2ff" },
  footer: { marginTop: "60px", color: "#475569", fontSize: "0.85rem" },
};