"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function IFrameContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: 'general'
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Check if this is loaded in an iframe
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const parentDomain = searchParams.get('parent') || 'unknown';

  useEffect(() => {
    // Post message to parent when content loads
    if (isInIframe && window.parent) {
      window.parent.postMessage({
        type: 'iframe_loaded',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
    }
  }, [isInIframe]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Send input changes to parent
    if (isInIframe && window.parent) {
      window.parent.postMessage({
        type: 'form_input_change',
        field: name,
        value: value,
        timestamp: new Date().toISOString()
      }, '*');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
      isInIframe: isInIframe,
      parentDomain: parentDomain,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    setSubmissionData(submission);
    setSubmitted(true);

    // Post message to parent about form submission
    if (isInIframe && window.parent) {
      window.parent.postMessage({
        type: 'form_submitted',
        data: submission,
        timestamp: new Date().toISOString()
      }, '*');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
      category: 'general'
    });
    setSubmitted(false);
    setSubmissionData(null);

    if (isInIframe && window.parent) {
      window.parent.postMessage({
        type: 'form_reset',
        timestamp: new Date().toISOString()
      }, '*');
    }
  };

  const sendTestMessage = () => {
    if (isInIframe && window.parent) {
      window.parent.postMessage({
        type: 'test_message',
        message: 'Hello from iframe!',
        data: {
          currentTime: new Date().toISOString(),
          formFilled: Object.values(formData).some(value => value.trim() !== '')
        }
      }, '*');
    }
  };

  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: isInIframe ? '#f8f9fa' : '#fff',
      border: isInIframe ? '2px solid #007bff' : 'none',
      borderRadius: isInIframe ? '8px' : '0',
      margin: isInIframe ? '1rem' : '0'
    }}>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: isInIframe ? '#d4edda' : '#f0f8ff', borderRadius: '4px' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
          {isInIframe ? '📱 iFrame Content' : '🌐 Standalone Page'}
        </h1>
        <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          <div>Status: {isInIframe ? 'Loaded inside iframe' : 'Standalone page'}</div>
          <div>Parent Domain: {parentDomain}</div>
          <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>Contact Form</h2>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email Address:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Message:
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Enter your message here..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                flexGrow: 1
              }}
            >
              Submit Form
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reset
            </button>
          </div>
        </form>
      ) : (
        <div style={{ padding: '2rem', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ color: '#155724', margin: '0 0 1rem 0' }}>
            ✅ Form Submitted Successfully!
          </h2>
          <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <h3>Submission Details:</h3>
            <pre style={{ fontSize: '0.9rem', overflow: 'auto' }}>
              {JSON.stringify(submissionData, null, 2)}
            </pre>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Submit Another Form
          </button>
        </div>
      )}

      {isInIframe && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>iFrame Communication Testing</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={sendTestMessage}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Test Message to Parent
            </button>
            <button
              onClick={() => window.parent?.postMessage({ type: 'resize_request', height: document.body.scrollHeight }, '*')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Request Resize
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
            Messages are sent to parent window using postMessage API
          </div>
        </div>
      )}

      {!isInIframe && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#721c24' }}>
            ⚠️ This page is designed for iframe testing
          </h3>
          <p style={{ margin: '0', color: '#721c24' }}>
            Visit <a href="/iframeform" style={{ color: '#721c24' }}>/iframeform</a> to see this page loaded within an iframe for proper testing.
          </p>
        </div>
      )}
    </div>
  );
}

export default function IFrameContentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading iframe content...</div>}>
      <IFrameContent />
    </Suspense>
  );
}