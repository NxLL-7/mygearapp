import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './TopLoader.css';

export default function TopLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const startLoading = useCallback(() => {
    setVisible(true);
    setProgress(10);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(intervalRef.current);
          return 90;
        }
        return p + Math.random() * 15;
      });
    }, 300);
  }, []);

  const stopLoading = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setProgress(0), 200);
    }, 400);
  }, []);

  // Route change loading
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, startLoading, stopLoading]);

  // Global event listener
  useEffect(() => {
    window.addEventListener('start-loading', startLoading);
    window.addEventListener('stop-loading', stopLoading);
    return () => {
      window.removeEventListener('start-loading', startLoading);
      window.removeEventListener('stop-loading', stopLoading);
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [startLoading, stopLoading]);

  return (
    <div className="top-loader-container" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      <div 
        className="top-loader-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
