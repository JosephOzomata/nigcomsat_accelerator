// Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-slate-950 z-0">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.35s ease-out both; }
      `}</style>

      {/* Shared background video — same on every page */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="https://res.cloudinary.com/wapbiprz/video/upload/v1785877236/74a66690c6_blue-earth-1920x1080_tfkk09.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Each page's unique content renders here */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}