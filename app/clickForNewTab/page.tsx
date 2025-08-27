"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ClickForNewTabPage() {
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);
  const [popupBlocked, setPopupBlocked] = useState<string | null>(null);

  const openNewTab = (url: string, method: 'link' | 'window.open' | 'form', target?: string) => {
    setPopupBlocked(null);
    const timestamp = new Date().toLocaleTimeString();
    
    switch (method) {
      case 'window.open':
        try {
          const newWindow = window.open(url, target || '_blank', 'noopener,noreferrer');
          if (newWindow) {
            setOpenedTabs(prev => [...prev, `${url} (window.open) at ${timestamp}`]);
          } else {
            setPopupBlocked(`Failed to open ${url} - popup may have been blocked`);
          }
        } catch (error) {
          setPopupBlocked(`Error opening ${url}: ${error}`);
        }
        break;
      
      case 'link':
        // This will be handled by the <a> tag's native behavior
        setOpenedTabs(prev => [...prev, `${url} (link click) at ${timestamp}`]);
        break;
        
      case 'form':
        // Create a temporary form and submit it
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = url;
        form.target = target || '_blank';
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setOpenedTabs(prev => [...prev, `${url} (form submit) at ${timestamp}`]);
        break;
    }
  };

  const testUrls = [
    { url: '/', label: 'Homepage' },
    { url: '/jsdialogs', label: 'JS Dialogs' },
    { url: '/contextMenu', label: 'Context Menu' },
    { url: '/region', label: 'Region Detection' },
    { url: 'https://www.example.com', label: 'External: Example.com' },
    { url: 'https://httpbin.org/delay/2', label: 'External: HTTPBin Delay' }
  ];

  const clearHistory = () => {
    setOpenedTabs([]);
    setPopupBlocked(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>New Tab Testing</h1>
      <p>Test various methods of opening new browser tabs and windows.</p>

      {popupBlocked && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginTop: '1rem'
        }}>
          <strong>Popup Blocked:</strong> {popupBlocked}
          <br />
          <small>Check your browser's popup blocker settings and try again.</small>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          <h2>Method 1: Standard Links (target="_blank")</h2>
          <p>Using standard HTML links with target="_blank" attribute.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {testUrls.map((test, index) => (
              <a
                key={index}
                href={test.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => openNewTab(test.url, 'link')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  display: 'block'
                }}
              >
                📄 {test.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <h2>Method 2: JavaScript window.open()</h2>
          <p>Using JavaScript's window.open() function with various parameters.</p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {testUrls.map((test, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '150px', fontWeight: 'bold' }}>
                  {test.label}:
                </div>
                <button
                  onClick={() => openNewTab(test.url, 'window.open', '_blank')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🪟 New Tab
                </button>
                <button
                  onClick={() => openNewTab(test.url, 'window.open', 'popup')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  📱 Named Window
                </button>
                <button
                  onClick={() => {
                    const newWindow = window.open(test.url, 'sized', 'width=800,height=600,scrollbars=yes,resizable=yes');
                    if (newWindow) {
                      setOpenedTabs(prev => [...prev, `${test.url} (sized window) at ${new Date().toLocaleTimeString()}`]);
                    } else {
                      setPopupBlocked(`Failed to open sized window for ${test.url}`);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  📏 Sized Window
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
          <h2>Method 3: Form Submission</h2>
          <p>Using form submission with target="_blank" to open in new tab.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {testUrls.slice(0, 4).map((test, index) => (
              <button
                key={index}
                onClick={() => openNewTab(test.url, 'form')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📋 {test.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
          <h2>Advanced Tab Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => {
                // Open multiple tabs simultaneously
                const urls = ['/', '/jsdialogs', '/contextMenu'];
                urls.forEach((url, i) => {
                  setTimeout(() => openNewTab(url, 'window.open'), i * 100);
                });
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🚀 Open Multiple Tabs
            </button>
            
            <button
              onClick={() => {
                const newWindow = window.open('', 'dynamic', 'width=600,height=400');
                if (newWindow) {
                  newWindow.document.write(`
                    <html>
                      <head><title>Dynamic Content</title></head>
                      <body style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>Dynamically Created Window</h1>
                        <p>This window was created and populated via JavaScript at ${new Date().toLocaleString()}</p>
                        <button onclick="window.close()">Close Window</button>
                      </body>
                    </html>
                  `);
                  newWindow.document.close();
                  setOpenedTabs(prev => [...prev, `Dynamic content window at ${new Date().toLocaleTimeString()}`]);
                }
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#795548',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ✨ Dynamic Content Window
            </button>

            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  // Test if we can open a new tab from a button click (user-initiated)
                  const newWindow = window.open('/region', '_blank');
                  if (newWindow) {
                    // Focus the new window
                    newWindow.focus();
                    setOpenedTabs(prev => [...prev, `Focused new tab at ${new Date().toLocaleTimeString()}`]);
                  }
                } else {
                  alert('Service Worker not supported');
                }
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#607d8b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🎯 Focus New Tab
            </button>
          </div>
        </div>
      </div>

      {openedTabs.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Tab Opening History</h3>
            <button
              onClick={clearHistory}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Clear History
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {openedTabs.map((tab, index) => (
              <div
                key={index}
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid #dee2e6',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>New Tab Testing Notes</h3>
        
        <h4>Browser Behavior:</h4>
        <ul>
          <li><strong>Popup Blockers:</strong> Most browsers block window.open() unless triggered by user interaction</li>
          <li><strong>User Gesture:</strong> New tabs/windows typically require a direct user action (click, keypress)</li>
          <li><strong>Security:</strong> Modern browsers restrict programmatic tab opening for security reasons</li>
        </ul>

        <h4>Method Comparison:</h4>
        <ul>
          <li><strong>Links (target="_blank"):</strong> Most reliable, SEO-friendly, accessible</li>
          <li><strong>window.open():</strong> More control, can be blocked, allows dynamic content</li>
          <li><strong>Form submission:</strong> Useful for POST requests, less common</li>
        </ul>

        <h4>Best Practices:</h4>
        <ul>
          <li>Always use <code>rel="noopener noreferrer"</code> with target="_blank"</li>
          <li>Handle popup blocker scenarios gracefully</li>
          <li>Provide fallback options when new tabs are blocked</li>
          <li>Consider user experience - avoid opening too many tabs</li>
        </ul>

        <h4>Testing Scenarios:</h4>
        <ul>
          <li>Try with different popup blocker settings</li>
          <li>Test on mobile devices (limited tab support)</li>
          <li>Verify noopener/noreferrer security attributes</li>
          <li>Check focus behavior in new tabs</li>
        </ul>
      </div>
    </div>
  );
}