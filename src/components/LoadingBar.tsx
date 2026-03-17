import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function LoadingBar() {
  const location = useLocation();
  const [animKey, setAnimKey] = useState(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setAnimKey((k) => k + 1);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @keyframes nx-loading-bar {
          0%   { width: 0%;   opacity: 1; }
          65%  { width: 85%;  opacity: 1; }
          90%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .nx-loading-bar {
          animation: nx-loading-bar 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none">
        {animKey > 0 && (
          <div
            key={animKey}
            className="h-full nx-loading-bar bg-gh-accent-emphasis"
          />
        )}
      </div>
    </>
  );
}
