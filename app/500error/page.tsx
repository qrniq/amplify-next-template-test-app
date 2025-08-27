"use client";

import { useState } from 'react';
import Link from 'next/link';

interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  timestamp: string;
  requestId: string;
  [key: string]: any;
}

export default function Error500Page() {
  const [response, setResponse] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<any[]>([]);

  const makeErrorRequest = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(endpoint, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const data = await response.json();
      
      setResponse(data);
      setRequestHistory(prev => [{
        endpoint,
        method,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        timestamp: new Date().toISOString(),
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const errorData = {
        error: 'Network Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        requestId: 'client-error'
      };
      
      setResponse(errorData);
      setRequestHistory(prev => [{
        endpoint,
        method,
        status: 'ERROR',
        statusText: 'Network Error',
        responseTime,
        timestamp: new Date().toISOString(),
        data: errorData,
        headers: {}
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const errorTypes = [
    { type: 'generic', label: 'Generic Error', description: 'Basic 500 error' },
    { type: 'database', label: 'Database Error', description: 'Database connection failure' },
    { type: 'timeout', label: 'Timeout Error', description: 'Request timeout simulation' },
    { type: 'validation', label: 'Validation Error', description: 'Invalid request parameters' },
    { type: 'auth', label: 'Auth Error', description: 'Authentication failure' },
    { type: 'ratelimit', label: 'Rate Limit Error', description: 'Too many requests' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>HTTP 500 Error Testing</h1>
      <p>Test various types of HTTP 500 server errors and error handling scenarios.</p>

      <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
          <h2>Controlled 500 Errors</h2>
          <p>These endpoints return structured 500 errors with different error types.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {errorTypes.map((errorType, index) => (
              <div key={index} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{errorType.label}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6c757d' }}>
                  {errorType.description}
                </p>
                <button
                  onClick={() => makeErrorRequest(`/api/500?type=${errorType.type}`)}
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: loading ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    width: '100%'
                  }}
                >
                  {loading ? 'Loading...' : 'Test Error'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
          <h2>Actual Server Errors</h2>
          <p>These endpoints throw real server-side exceptions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => makeErrorRequest('/api/500/error', 'GET')}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              💥 Throw Error (GET)
            </button>
            <button
              onClick={() => makeErrorRequest('/api/500/error', 'POST', { test: 'data' })}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#e83e8c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              💥 Random Error (POST)
            </button>
            <button
              onClick={() => makeErrorRequest('/api/500/error', 'PUT')}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#fd7e14',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              ⏱️ Async Error (PUT)
            </button>
            <button
              onClick={() => makeErrorRequest('/api/500/error', 'DELETE')}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#20c997',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              🔄 Response Error (DELETE)
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h2>Error with Delays</h2>
          <p>Test error responses with artificial delays.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1000, 3000, 5000].map(delay => (
              <button
                key={delay}
                onClick={() => makeErrorRequest(`/api/500?type=timeout&delay=${delay}`)}
                disabled={loading}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: loading ? '#ccc' : '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                ⏳ {delay}ms Delay
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <h2>POST Error Testing</h2>
          <p>Test 500 errors with POST requests and request bodies.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => makeErrorRequest('/api/500', 'POST', { errorType: 'database', userId: 123 })}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              📝 POST with Data
            </button>
            <button
              onClick={() => makeErrorRequest('/api/500', 'POST', { invalidJson: 'test', nested: { data: [1,2,3] } })}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              📋 POST Complex Data
            </button>
          </div>
        </div>
      </div>

      {response && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2>Last Error Response</h2>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1rem', 
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong>Error:</strong><br />
                <span style={{ color: '#dc3545' }}>{response.error}</span>
              </div>
              <div>
                <strong>Code:</strong><br />
                <code>{response.code}</code>
              </div>
              <div>
                <strong>Request ID:</strong><br />
                <code>{response.requestId}</code>
              </div>
              <div>
                <strong>Timestamp:</strong><br />
                <code>{new Date(response.timestamp).toLocaleString()}</code>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Message:</strong><br />
              <span>{response.message}</span>
            </div>
            
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007bff' }}>
                View Full Response
              </summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                fontSize: '0.8rem',
                overflow: 'auto',
                marginTop: '0.5rem'
              }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {requestHistory.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <h2>Request History</h2>
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {requestHistory.map((request, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '1rem', 
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  border: '1px solid #dee2e6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{request.method}</strong> {request.endpoint}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {new Date(request.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>Status: <strong style={{ color: request.status >= 500 ? '#dc3545' : request.status >= 400 ? '#ffc107' : '#28a745' }}>{request.status}</strong></span>
                  <span>Time: <strong>{request.responseTime}ms</strong></span>
                  {request.data?.requestId && (
                    <span>ID: <code>{request.data.requestId}</code></span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {request.data?.message || request.statusText}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setRequestHistory([])}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginTop: '1rem'
            }}
          >
            Clear History
          </button>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>HTTP 500 Error Testing Notes</h3>
        
        <h4>Types of 500 Errors:</h4>
        <ul>
          <li><strong>Controlled Errors:</strong> Structured JSON responses with error details</li>
          <li><strong>Actual Exceptions:</strong> Real server-side errors and exceptions</li>
          <li><strong>Timeout Errors:</strong> Delayed responses simulating timeouts</li>
          <li><strong>Async Errors:</strong> Promises that reject with errors</li>
        </ul>

        <h4>Error Response Structure:</h4>
        <ul>
          <li><strong>error:</strong> Human-readable error title</li>
          <li><strong>message:</strong> Detailed error description</li>
          <li><strong>code:</strong> Machine-readable error identifier</li>
          <li><strong>requestId:</strong> Unique identifier for tracking</li>
          <li><strong>timestamp:</strong> When the error occurred</li>
        </ul>

        <h4>Testing Scenarios:</h4>
        <ul>
          <li>Different HTTP methods (GET, POST, PUT, DELETE)</li>
          <li>Various error types and codes</li>
          <li>Error responses with and without delays</li>
          <li>Client-side error handling and retry logic</li>
          <li>Error logging and monitoring simulation</li>
        </ul>

        <h4>Production Considerations:</h4>
        <ul>
          <li>Never expose sensitive error details to clients</li>
          <li>Log detailed errors server-side for debugging</li>
          <li>Implement proper error monitoring and alerting</li>
          <li>Use consistent error response formats</li>
          <li>Include request IDs for error tracing</li>
        </ul>
      </div>
    </div>
  );
}