/**
  ProcessingScreen Component

 * This component is responsible for displaying a processing screen during image processing or any other 
 * long-running task. It includes a visual progress bar and a spinner to indicate that a process is 
 * ongoing. The progress bar is animated to fill up over the time specified by the `processingTime` prop.
 
 */
  import React, { useState, useEffect } from 'react';
  import '../styles/ProcessingScreen.css';
  
  const ProcessingScreen = ({ processingTime, onAbort, onComplete }) => {
      const [progress, setProgress] = useState(0);
  
      useEffect(() => {
          if (!processingTime || processingTime <= 0) {
              console.error("Invalid processing time:", processingTime);
              return;
          }
  
          const totalSteps = 100;
          const intervalTime = (processingTime * 1000) / totalSteps; 
  
          const interval = setInterval(() => {
              setProgress(prevProgress => {
                  const newProgress = prevProgress + 1;
                  if (newProgress >= 100) {
                      clearInterval(interval);
                      return 100;
                  }
                  return newProgress;
              });
          }, intervalTime);
  
          return () => clearInterval(interval);
      }, [processingTime]);
  
      useEffect(() => {
          if (progress >= 100) {
              // Delay before calling onComplete to ensure processing is complete
              const delay = setTimeout(() => {
                  onComplete();
              }, 100); //delay after progress reaches 100%
              return () => clearTimeout(delay);
          }
      }, [progress, onComplete]);
  
      return (
          <div className="processing-screen">
              <div className="spinner"></div>
              <p>In Process</p>
              <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}>
                      <span className="progress-text">{Math.floor(progress)}%</span>
                  </div>
              </div>
              <button className="abort-button" onClick={onAbort}>
                  Abort
              </button>
          </div>
      );
  };
  
  export default ProcessingScreen;
  