import { useEffect, useState } from 'react';

interface LinearProgressProps {
  isLoading: boolean;
  duration?: number;
  color?: string;
  height?: number;
  indeterminate?: boolean;
  progress?: number; // 0-100
}

export default function LinearProgress({
  isLoading,
  duration = 2000,
  color = 'bg-primary',
  height = 3,
  indeterminate = true,
  progress = 0
}: LinearProgressProps) {
  const [width, setWidth] = useState(indeterminate ? 0 : progress);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      
      if (indeterminate) {
        // Simulate progress for indeterminate state
        const timer = setInterval(() => {
          setWidth(oldWidth => {
            // Slow down as it approaches 90%
            const increment = oldWidth < 30 ? 15 : oldWidth < 60 ? 8 : oldWidth < 85 ? 3 : 1;
            const newWidth = Math.min(oldWidth + increment, 90);
            return newWidth;
          });
        }, duration / 20);

        return () => clearInterval(timer);
      } else {
        // Use actual progress
        setWidth(progress);
      }
    } else {
      // When loading completes, quickly finish the bar
      setWidth(100);
      
      // Hide after completion animation
      const timer = setTimeout(() => {
        setVisible(false);
        // Reset width for next time
        setTimeout(() => setWidth(0), 300);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, indeterminate, duration, progress]);

  // Container always stays full width
  return (
    <div className="w-full overflow-hidden" style={{ height: `${height}px` }}>
      {visible && (
        <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`absolute top-0 left-0 h-full ${color}`}
            style={{
              width: `${width}%`,
              transition: 'width 0.3s ease-in-out'
            }}
          />
          
          {indeterminate && width < 90 && (
            <div 
              className={`absolute top-0 left-0 h-full ${color} opacity-30`}
              style={{
                width: '20%',
                transform: `translateX(${width}%)`,
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.6; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}