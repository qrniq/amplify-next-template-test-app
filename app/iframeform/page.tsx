"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface IFrameMessage {
  type: string;
  data?: any;
  field?: string;
  value?: string;
  message?: string;
  url?: string;
  height?: number;
  timestamp: string;
}

export default function IFrameFormPage() {
  const [messages, setMessages] = useState<IFrameMessage[]>([]);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [iframeUrl, setIframeUrl] = useState('/iframecontent?parent=iframeform');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In a real application, you should validate the origin
      // if (event.origin !== 'https://your-trusted-domain.com') return;
      
      const message: IFrameMessage = event.data;
      
      if (message && message.type) {
        setMessages(prev => [message, ...prev.slice(0, 19)]); // Keep last 20 messages
        
        // Handle specific message types
        switch (message.type) {
          case 'resize_request':
            if (message.height && message.height > 0) {
              setIframeHeight(Math.min(message.height + 50, 1000)); // Cap at 1000px
            }
            break;
          case 'form_submitted':
            console.log('Form submitted in iframe:', message.data);
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendMessageToIFrame = (messageType: string, data: any = {}) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: messageType,
        ...data,
        timestamp: new Date().toISOString(),
        from: 'parent'
      }, '*');
    }
  };

  const reloadIFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl + '&reload=' + Date.now();
    }
  };

  const changeIFrameUrl = (newUrl: string) => {
    setIframeUrl(newUrl);
    if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>iFrame Form Testing</h1>
      <p>This page demonstrates form handling within iframes and cross-frame communication.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', marginTop: '2rem' }}>
        
        <div>
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>iFrame Controls</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={reloadIFrame}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reload iFrame
              </button>
              <button
                onClick={() => sendMessageToIFrame('parent_greeting', { message: 'Hello from parent!' })}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Send Message
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Height:
                <input
                  type="number"
                  value={iframeHeight}
                  onChange={(e) => setIframeHeight(parseInt(e.target.value) || 600)}
                  min="300"
                  max="1000"
                  step="50"
                  style={{
                    width: '80px',
                    padding: '0.25rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </label>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Quick URL Changes:</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => changeIFrameUrl('/iframecontent?parent=iframeform')}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Form Page
                </button>
                <button
                  onClick={() => changeIFrameUrl('/jsdialogs')}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  JS Dialogs
                </button>
                <button
                  onClick={() => changeIFrameUrl('/contextMenu')}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Context Menu
                </button>
              </div>
            </div>
          </div>

          <div style={{ border: '3px solid #007bff', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>📱 Embedded iFrame Content</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {iframeHeight}px height
              </span>
            </div>
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              width="100%"
              height={iframeHeight}
              style={{
                border: 'none',
                display: 'block',
                backgroundColor: 'white'
              }}
              title="iFrame Form Content"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>

        <div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            height: 'fit-content',
            position: 'sticky',
            top: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Message Log</h2>
              <button
                onClick={clearMessages}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
            
            <div style={{ 
              maxHeight: '500px', 
              overflow: 'auto',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              {messages.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}>
                  No messages received yet.<br />
                  Try interacting with the iframe content.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      borderBottom: index < messages.length - 1 ? '1px solid #eee' : 'none',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: message.type === 'form_submitted' ? '#28a745' : 
                              message.type === 'iframe_loaded' ? '#007bff' :
                              message.type.includes('error') ? '#dc3545' : '#6c757d'
                      }}>
                        {message.type}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {message.field && (
                      <div style={{ color: '#495057', marginBottom: '0.25rem' }}>
                        Field: <code>{message.field}</code> = "{message.value}"
                      </div>
                    )}
                    
                    {message.message && (
                      <div style={{ color: '#495057', marginBottom: '0.25rem' }}>
                        Message: {message.message}
                      </div>
                    )}
                    
                    {message.url && (
                      <div style={{ color: '#495057', marginBottom: '0.25rem' }}>
                        URL: <code style={{ fontSize: '0.8rem' }}>{message.url}</code>
                      </div>
                    )}
                    
                    {message.data && typeof message.data === 'object' && (
                      <details style={{ marginTop: '0.5rem' }}>
                        <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#007bff' }}>
                          View Data
                        </summary>
                        <pre style={{ 
                          fontSize: '0.7rem',
                          backgroundColor: '#f8f9fa',
                          padding: '0.5rem',
                          borderRadius: '3px',
                          margin: '0.25rem 0 0 0',
                          overflow: 'auto',
                          maxHeight: '150px'
                        }}>
                          {JSON.stringify(message.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>iFrame Testing Features</h3>
        <p>
          This page demonstrates various iframe integration scenarios commonly used in web applications.
        </p>
        
        <h4>Communication Features:</h4>
        <ul>
          <li><strong>PostMessage API:</strong> Secure cross-frame communication</li>
          <li><strong>Form Events:</strong> Monitor form interactions within iframe</li>
          <li><strong>Auto-resize:</strong> Dynamic height adjustment based on content</li>
          <li><strong>Message Logging:</strong> Real-time display of all cross-frame messages</li>
        </ul>

        <h4>Security Features:</h4>
        <ul>
          <li><strong>Sandbox Attributes:</strong> Controlled iframe permissions</li>
          <li><strong>Origin Validation:</strong> Message source verification (commented for demo)</li>
          <li><strong>Content Security:</strong> Restricted iframe capabilities</li>
        </ul>

        <h4>Test Scenarios:</h4>
        <ul>
          <li>Fill out and submit the form within the iframe</li>
          <li>Watch real-time form input changes in the message log</li>
          <li>Try loading different pages in the iframe using the URL buttons</li>
          <li>Test the resize functionality by changing content</li>
          <li>Use browser dev tools to inspect cross-frame communication</li>
        </ul>

        <h4>Use Cases:</h4>
        <ul>
          <li>Embedded payment forms (Stripe, PayPal)</li>
          <li>Third-party widgets (social media, maps)</li>
          <li>Sandboxed user-generated content</li>
          <li>Cross-domain form integration</li>
        </ul>
      </div>
    </div>
  );
}