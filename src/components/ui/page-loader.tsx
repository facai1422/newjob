import React from 'react';

export default function PageLoader() {
  return (
    <div className="page-loader fixed inset-0 z-[99999] flex items-center justify-center bg-black">
      <div className="loader-wrapper">
        <span className="loader-letter">L</span>
        <span className="loader-letter">o</span>
        <span className="loader-letter">a</span>
        <span className="loader-letter">d</span>
        <span className="loader-letter">i</span>
        <span className="loader-letter">n</span>
        <span className="loader-letter">g</span>
        <div className="loader-bg-1" />
        <div className="loader-bg-2" />
        <div className="loader" />
      </div>
    </div>
  );
}


