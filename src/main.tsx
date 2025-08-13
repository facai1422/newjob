import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

// Render loader first so首次/刷新时先显示加载动画
root.render(
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

window.addEventListener('load', () => {
  root.render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
});