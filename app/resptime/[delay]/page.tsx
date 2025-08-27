"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ResponseTimeResult {
  message: string;
  requestedDelay: number;
  actualDelay: number;
  startTime: number;
  endTime: number;
  actualResponseTime: number;
  timestamp: string;
  dataSize: number;
  mockData: {
    users: Array<{ id: number; name: string; email: string; active: boolean }>;
    products: Array<{ id: number; name: string; price: number; inStock: boolean }>;
  };
  performance?: {
    memoryUsage: any;
    cpuTime: any;
  };
}

export default function ResponseTimePage() {
  const params = useParams();
  const delay = Array.isArray(params.delay) ? params.delay[0] : params.delay;
  const [result, setResult] = useState<ResponseTimeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customDelay, setCustomDelay] = useState(delay || '2000');
  const [testHistory, setTestHistory] = useState<ResponseTimeResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});

  const runResponseTimeTest = async (testDelay?: string) => {
    const delayToUse = testDelay || delay || '2000';
    setLoading(true);
    setError(null);
    
    // Capture performance metrics before request
    const startPerf = performance.now();
    const startMemory = (performance as any).memory ? { ...(performance as any).memory } : null;
    
    try {
      const response = await fetch(`/api/resptime/${delayToUse}`);
      const endPerf = performance.now();
      const clientResponseTime = endPerf - startPerf;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: ResponseTimeResult = await response.json();
      
      // Calculate performance metrics
      const endMemory = (performance as any).memory ? { ...(performance as any).memory } : null;
      const metrics = {
        clientResponseTime: Math.round(clientResponseTime),
        responseSize: JSON.stringify(data).length,
        memoryBefore: startMemory,
        memoryAfter: endMemory,
        memoryDelta: startMemory && endMemory ? {
          usedJSHeapSize: endMemory.usedJSHeapSize - startMemory.usedJSHeapSize,
          totalJSHeapSize: endMemory.totalJSHeapSize - startMemory.totalJSHeapSize
        } : null
      };
      
      setPerformanceMetrics(metrics);
      setResult(data);
      setTestHistory(prev => [data, ...prev.slice(0, 4)]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (delay) {
      runResponseTimeTest();
    }
  }, [delay]);

  const handleCustomTest = () => {
    runResponseTimeTest(customDelay);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>Response Time Testing</h1>
      <p>This page tests complete server response timing with realistic data payloads.</p>
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
              {loading ? 'Testing...' : 'Run Response Test'}
            </button>
            <button 
              onClick={() => runResponseTimeTest(delay)}
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
            <div>Testing response time with {customDelay}ms delay...</div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                backgroundColor: '#eee', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #28a745 0%, #28a745 50%, transparent 50%)',
                  backgroundSize: '30px 100%',
                  animation: 'loading 1.5s linear infinite'
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
            <h2>Response Time Results</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>Server Response Time:</strong><br />
                <span style={{ fontSize: '1.5rem', color: '#28a745' }}>{result.actualResponseTime}ms</span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>Client Response Time:</strong><br />
                <span style={{ fontSize: '1.5rem', color: '#007bff' }}>{performanceMetrics.clientResponseTime}ms</span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>Response Size:</strong><br />
                <span style={{ fontSize: '1.2rem' }}>{result.dataSize} bytes</span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>Requested Delay:</strong><br />
                <span style={{ fontSize: '1.2rem' }}>{result.requestedDelay}ms</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <h3>Mock Users Data ({result.mockData.users.length} items)</h3>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {result.mockData.users.slice(0, 3).map(user => (
                    <div key={user.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                      <strong>{user.name}</strong> ({user.email})<br />
                      <span style={{ color: user.active ? '#28a745' : '#dc3545' }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                  {result.mockData.users.length > 3 && (
                    <div style={{ padding: '0.5rem', color: '#6c757d' }}>
                      ... and {result.mockData.users.length - 3} more users
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <h3>Mock Products Data ({result.mockData.products.length} items)</h3>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {result.mockData.products.map(product => (
                    <div key={product.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                      <strong>{product.name}</strong> - ${product.price}<br />
                      <span style={{ color: product.inStock ? '#28a745' : '#dc3545' }}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <details style={{ marginTop: '1.5rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                View Performance Details
              </summary>
              <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                {performanceMetrics.memoryDelta && (
                  <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                    <h4>Memory Usage Changes</h4>
                    <div>
                      JS Heap Size Change: {(performanceMetrics.memoryDelta.usedJSHeapSize / 1024).toFixed(2)} KB
                    </div>
                  </div>
                )}
                {result.performance && (
                  <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                    <h4>Server Performance</h4>
                    <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                      {JSON.stringify(result.performance, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </div>

      {testHistory.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>Response Time History</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {testHistory.map((test, index) => (
              <div key={index} style={{ 
                padding: '1rem', 
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Delay:</strong> {test.actualDelay}ms | 
                  <strong> Response:</strong> {test.actualResponseTime}ms | 
                  <strong> Size:</strong> {(test.dataSize / 1024).toFixed(2)} KB
                </div>
                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {new Date(test.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>About Response Time Testing</h3>
        <p>
          Response time testing measures the complete time from request initiation to receiving 
          the full response payload, including data processing and transmission time.
        </p>
        
        <h4>Differences from TTFB:</h4>
        <ul>
          <li><strong>TTFB:</strong> Measures time to first byte only</li>
          <li><strong>Response Time:</strong> Measures complete request-response cycle</li>
          <li><strong>Data Payload:</strong> This test includes realistic JSON data (users, products)</li>
          <li><strong>Performance Metrics:</strong> Tracks memory usage and client-side timing</li>
        </ul>

        <h4>URL Pattern:</h4>
        <code>/resptime/[delay]</code> - where [delay] is the milliseconds to wait before responding
        
        <h4>Quick Test Links:</h4>
        <div style={{ marginTop: '1rem' }}>
          {[500, 1000, 2000, 3000, 5000, 10000].map(delayValue => (
            <Link 
              key={delayValue}
              href={`/resptime/${delayValue}`}
              style={{ 
                display: 'inline-block',
                margin: '0.25rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
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
          100% { background-position: 30px 0; }
        }
      `}</style>
    </div>
  );
}