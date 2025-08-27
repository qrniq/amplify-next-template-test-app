"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface TTFBResult {
  message: string;
  requestedDelay: number;
  actualDelay: number;
  startTime: number;
  endTime: number;
  actualResponseTime: number;
  timestamp: string;
}

export default function TTFBTestPage() {
  const params = useParams();
  const delay = Array.isArray(params.delay) ? params.delay[0] : params.delay;
  const [result, setResult] = useState<TTFBResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customDelay, setCustomDelay] = useState(delay || '1000');
  const [testHistory, setTestHistory] = useState<TTFBResult[]>([]);

  const runTTFBTest = async (testDelay?: string) => {
    const delayToUse = testDelay || delay || '1000';
    setLoading(true);
    setError(null);
    
    const clientStartTime = performance.now();
    
    try {
      const response = await fetch(`/api/ttfb/${delayToUse}`);
      const clientEndTime = performance.now();
      const clientResponseTime = clientEndTime - clientStartTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: TTFBResult = await response.json();
      
      // Add client-side timing information
      const enhancedResult = {
        ...data,
        clientResponseTime: Math.round(clientResponseTime)
      };
      
      setResult(enhancedResult as TTFBResult);
      setTestHistory(prev => [enhancedResult as TTFBResult, ...prev.slice(0, 4)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (delay) {
      runTTFBTest();
    }
  }, [delay]);

  const handleCustomTest = () => {
    runTTFBTest(customDelay);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>TTFB (Time To First Byte) Testing</h1>
      <p>This page tests server response timing with configurable delays.</p>
      <p>Current delay parameter: <strong>{delay}ms</strong></p>

      <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          <h2>Test Controls</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              {loading ? 'Testing...' : 'Run TTFB Test'}
            </button>
            <button 
              onClick={() => runTTFBTest(delay)}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Rerun Current Delay
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            borderRadius: '8px'
          }}>
            <div>Testing TTFB with {customDelay}ms delay...</div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#eee', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #0070f3 0%, #0070f3 50%, transparent 50%)',
                  backgroundSize: '20px 100%',
                  animation: 'loading 1s linear infinite'
                }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px' }}>
            <h2>Test Results</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Requested Delay:</strong><br />
                {result.requestedDelay}ms
              </div>
              <div>
                <strong>Actual Server Delay:</strong><br />
                {result.actualDelay}ms
              </div>
              <div>
                <strong>Server Response Time:</strong><br />
                {result.actualResponseTime}ms
              </div>
              <div>
                <strong>Client Response Time:</strong><br />
                {(result as any).clientResponseTime}ms
              </div>
            </div>
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                View Detailed Results
              </summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                backgroundColor: '#f8f9fa', 
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                overflow: 'auto'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {testHistory.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>Test History</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {testHistory.map((test, index) => (
              <div key={index} style={{ 
                padding: '1rem', 
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>Delay:</strong> {test.actualDelay}ms | 
                    <strong> Response:</strong> {test.actualResponseTime}ms
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {new Date(test.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>About TTFB Testing</h3>
        <p>
          Time To First Byte (TTFB) measures the time from when a client makes an HTTP request 
          to when it receives the first byte of the response from the server.
        </p>
        
        <h4>What This Test Measures:</h4>
        <ul>
          <li><strong>Server Processing Time:</strong> How long the server takes to process the request</li>
          <li><strong>Network Latency:</strong> Round-trip time for the request/response</li>
          <li><strong>Client-Side Timing:</strong> Total time from client perspective</li>
        </ul>

        <h4>URL Pattern:</h4>
        <code>/ttfb/[delay]</code> - where [delay] is the milliseconds to wait before responding
        
        <h4>Common Delay Values:</h4>
        <div style={{ marginTop: '1rem' }}>
          {[100, 500, 1000, 2000, 5000].map(delayValue => (
            <Link 
              key={delayValue}
              href={`/ttfb/${delayValue}`}
              style={{ 
                display: 'inline-block',
                margin: '0.25rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
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
        @keyframes loading {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
}