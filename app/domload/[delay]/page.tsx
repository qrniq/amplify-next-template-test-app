"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ContentChunk {
  id: number;
  title: string;
  content: string;
  loadTime: number;
}

interface Widget {
  type: string;
  data: any;
}

interface DOMLoadResult {
  message: string;
  requestedDelay: number;
  actualDelay: number;
  contentChunks: ContentChunk[];
  widgets: Widget[];
  domStructure: {
    elements: number;
    estimatedDOMNodes: number;
    loadStrategy: string;
  };
  performanceHints: {
    totalDelay: number;
    chunkDelays: number[];
    recommendedBatchSize: number;
    estimatedRenderTime: number;
  };
}

export default function DOMLoadPage() {
  const params = useParams();
  const delay = Array.isArray(params.delay) ? params.delay[0] : params.delay;
  const [result, setResult] = useState<DOMLoadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customDelay, setCustomDelay] = useState(delay || '1500');
  const [loadedChunks, setLoadedChunks] = useState<Set<number>>(new Set());
  const [loadedWidgets, setLoadedWidgets] = useState<Set<number>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  const runDOMLoadTest = async (testDelay?: string) => {
    const delayToUse = testDelay || delay || '1500';
    setLoading(true);
    setError(null);
    setLoadedChunks(new Set());
    setLoadedWidgets(new Set());
    setLoadingProgress(0);
    clearTimeouts();
    
    try {
      const response = await fetch(`/api/domload/${delayToUse}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: DOMLoadResult = await response.json();
      setResult(data);
      
      // Start progressive DOM loading simulation
      const totalDelay = data.actualDelay;
      
      // Load content chunks progressively
      data.contentChunks.forEach((chunk, index) => {
        const timeout = setTimeout(() => {
          setLoadedChunks(prev => new Set([...Array.from(prev), chunk.id]));
          setLoadingProgress((index + 1) / (data.contentChunks.length + data.widgets.length) * 100);
        }, chunk.loadTime);
        timeoutRefs.current.push(timeout);
      });
      
      // Load widgets progressively after content
      data.widgets.forEach((widget, index) => {
        const widgetDelay = totalDelay + (index * 300); // Stagger widget loading
        const timeout = setTimeout(() => {
          setLoadedWidgets(prev => new Set([...Array.from(prev), index]));
          setLoadingProgress((data.contentChunks.length + index + 1) / (data.contentChunks.length + data.widgets.length) * 100);
        }, widgetDelay);
        timeoutRefs.current.push(timeout);
      });
      
      // Mark loading complete
      const completeTimeout = setTimeout(() => {
        setLoading(false);
        setLoadingProgress(100);
      }, totalDelay + (data.widgets.length * 300) + 500);
      timeoutRefs.current.push(completeTimeout);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (delay) {
      runDOMLoadTest();
    }
    return clearTimeouts;
  }, [delay]);

  const handleCustomTest = () => {
    runDOMLoadTest(customDelay);
  };

  const renderWidget = (widget: Widget, index: number) => {
    const isLoaded = loadedWidgets.has(index);
    
    if (!isLoaded) {
      return (
        <div key={index} style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <div style={{ animation: 'pulse 1.5s infinite' }}>
            Loading {widget.type} widget...
          </div>
        </div>
      );
    }

    switch (widget.type) {
      case 'chart':
        return (
          <div key={index} style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <h3>Monthly Chart Data</h3>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'end', height: '100px' }}>
              {widget.data.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: `${item.value}%`,
                    backgroundColor: '#2196f3',
                    borderRadius: '2px 2px 0 0'
                  }}
                  title={`Month ${item.month}: ${item.value}`}
                />
              ))}
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div key={index} style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <h3>Statistics Dashboard</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {widget.data.users.toLocaleString()}
                </div>
                <div>Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
                  {widget.data.orders.toLocaleString()}
                </div>
                <div>Orders</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9c27b0' }}>
                  ${widget.data.revenue.toLocaleString()}
                </div>
                <div>Revenue</div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div key={index} style={{ 
            padding: '1.5rem', 
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <h3>Recent Notifications</h3>
            <div style={{ maxHeight: '150px', overflow: 'auto' }}>
              {widget.data.map((notif: any) => (
                <div key={notif.id} style={{ 
                  padding: '0.5rem', 
                  borderBottom: '1px solid #ffcc02',
                  fontSize: '0.9rem'
                }}>
                  {notif.message}
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(notif.time).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'activities':
        return (
          <div key={index} style={{ 
            padding: '1.5rem', 
            backgroundColor: '#fce4ec',
            borderRadius: '8px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <h3>Recent Activities</h3>
            <div style={{ maxHeight: '150px', overflow: 'auto' }}>
              {widget.data.slice(0, 4).map((activity: any) => (
                <div key={activity.id} style={{ 
                  padding: '0.5rem', 
                  borderBottom: '1px solid #f8bbd9',
                  fontSize: '0.9rem'
                }}>
                  <strong>{activity.user}</strong> performed {activity.action}
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div key={index} style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            Unknown widget type: {widget.type}
          </div>
        );
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>DOM Load Testing</h1>
      <p>This page demonstrates progressive DOM loading with configurable delays.</p>
      <p>Current delay parameter: <strong>{delay}ms</strong></p>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2>Test Controls</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <label>
              Custom Delay (ms):
              <input 
                type="number" 
                value={customDelay}
                onChange={(e) => setCustomDelay(e.target.value)}
                min="0"
                max="30000"
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '120px'
                }}
              />
            </label>
            <button 
              onClick={handleCustomTest}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading DOM...' : 'Run DOM Load Test'}
            </button>
          </div>
          
          {(loading || loadingProgress > 0) && (
            <div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Loading Progress: {Math.round(loadingProgress)}%
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#eee', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  backgroundColor: loading ? '#ffc107' : '#28a745',
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '2rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <>
            <div style={{ marginBottom: '3rem' }}>
              <h2>Content Chunks (Progressive Loading)</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {result.contentChunks.map((chunk) => {
                  const isLoaded = loadedChunks.has(chunk.id);
                  return (
                    <div 
                      key={chunk.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: isLoaded ? '#d4edda' : '#f8f9fa',
                        border: `2px ${isLoaded ? 'solid' : 'dashed'} ${isLoaded ? '#c3e6cb' : '#dee2e6'}`,
                        borderRadius: '8px',
                        opacity: isLoaded ? 1 : 0.6,
                        animation: isLoaded ? 'fadeIn 0.5s ease-in' : 'none'
                      }}
                    >
                      {isLoaded ? (
                        <>
                          <h3>{chunk.title}</h3>
                          <p>{chunk.content}</p>
                          <small style={{ color: '#6c757d' }}>
                            Loaded after {chunk.loadTime}ms
                          </small>
                        </>
                      ) : (
                        <div style={{ animation: 'pulse 1.5s infinite' }}>
                          <div style={{ width: '60%', height: '20px', backgroundColor: '#dee2e6', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                          <div style={{ width: '80%', height: '16px', backgroundColor: '#dee2e6', borderRadius: '4px' }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h2>Dynamic Widgets (Post-Content Loading)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {result.widgets.map((widget, index) => renderWidget(widget, index))}
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
              <h3>DOM Structure Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Total Elements:</strong><br />
                  {result.domStructure.elements}
                </div>
                <div>
                  <strong>Estimated DOM Nodes:</strong><br />
                  {result.domStructure.estimatedDOMNodes}
                </div>
                <div>
                  <strong>Load Strategy:</strong><br />
                  {result.domStructure.loadStrategy}
                </div>
                <div>
                  <strong>Total Delay:</strong><br />
                  {result.performanceHints.totalDelay}ms
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>About DOM Load Testing</h3>
        <p>
          DOM load testing simulates how web pages progressively build their content structure 
          with realistic delays that might occur in real-world applications.
        </p>
        
        <h4>What This Test Demonstrates:</h4>
        <ul>
          <li><strong>Progressive Enhancement:</strong> Content loads in chunks over time</li>
          <li><strong>Asynchronous Loading:</strong> Different components load independently</li>
          <li><strong>Loading States:</strong> Visual feedback during content loading</li>
          <li><strong>Real-world Simulation:</strong> Mimics API calls, image loading, and widget rendering</li>
        </ul>

        <h4>Common Delay Scenarios:</h4>
        <div style={{ marginTop: '1rem' }}>
          {[500, 1000, 1500, 3000, 5000].map(delayValue => (
            <Link 
              key={delayValue}
              href={`/domload/${delayValue}`}
              style={{ 
                display: 'inline-block',
                margin: '0.25rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: 'black',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              {delayValue}ms
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}