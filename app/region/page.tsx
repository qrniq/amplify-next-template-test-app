"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RegionInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  headers: Record<string, string>;
}

export default function RegionPage() {
  const [regionInfo, setRegionInfo] = useState<RegionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/region')
      .then(response => response.json())
      .then((data: RegionInfo) => {
        setRegionInfo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading region information...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>Regional Detection Test</h1>
      <p>This page demonstrates IP-to-region mapping functionality using request headers and geolocation data.</p>

      {regionInfo && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h2>Detected Location Information</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    IP Address:
                  </td>
                  <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    {regionInfo.ip}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    Country:
                  </td>
                  <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    {regionInfo.country}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    Region:
                  </td>
                  <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    {regionInfo.region}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    City:
                  </td>
                  <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                    {regionInfo.city}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0' }}>
                    Timezone:
                  </td>
                  <td style={{ padding: '0.5rem 0' }}>
                    {regionInfo.timezone}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <details style={{ marginTop: '2rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '0.5rem' }}>
              View All Request Headers
            </summary>
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '1rem', 
              borderRadius: '4px',
              marginTop: '0.5rem',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              <pre style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(regionInfo.headers, null, 2)}
              </pre>
            </div>
          </details>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <h3>Testing Notes</h3>
            <ul>
              <li>IP detection works from various header sources (x-forwarded-for, x-real-ip, etc.)</li>
              <li>Geographic information depends on hosting platform capabilities</li>
              <li>CloudFront and Cloudflare headers are automatically parsed when available</li>
              <li>Fallback to "Unknown" when geographic data is unavailable</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Region Data
          </button>
        </div>
      )}
    </div>
  );
}