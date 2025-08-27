"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function JSDialogsPage() {
  const [lastResult, setLastResult] = useState<string>('');
  const [dialogHistory, setDialogHistory] = useState<string[]>([]);

  const addToHistory = (message: string) => {
    setDialogHistory(prev => [message, ...prev.slice(0, 9)]);
  };

  const handleAlert = () => {
    const message = "This is an alert dialog!";
    alert(message);
    setLastResult(`Alert shown: "${message}"`);
    addToHistory(`Alert: ${message}`);
  };

  const handleConfirm = () => {
    const message = "Do you want to proceed with this action?";
    const result = confirm(message);
    setLastResult(`Confirm result: ${result ? 'OK' : 'Cancel'}`);
    addToHistory(`Confirm "${message}" → ${result ? 'OK' : 'Cancel'}`);
  };

  const handlePrompt = () => {
    const message = "Please enter your name:";
    const defaultValue = "John Doe";
    const result = prompt(message, defaultValue);
    if (result !== null) {
      setLastResult(`Prompt result: "${result}"`);
      addToHistory(`Prompt "${message}" → "${result}"`);
    } else {
      setLastResult(`Prompt cancelled`);
      addToHistory(`Prompt "${message}" → Cancelled`);
    }
  };

  const handleCustomPrompt = () => {
    const customMessage = (document.getElementById('customMessage') as HTMLInputElement)?.value || "Custom message";
    alert(customMessage);
    setLastResult(`Custom alert shown: "${customMessage}"`);
    addToHistory(`Custom Alert: ${customMessage}`);
  };

  const handleSequentialDialogs = () => {
    const name = prompt("What's your name?", "");
    if (name) {
      const age = prompt(`Hello ${name}! What's your age?`, "");
      if (age) {
        const proceed = confirm(`${name}, age ${age}. Is this correct?`);
        if (proceed) {
          alert(`Welcome ${name}! You are ${age} years old.`);
          setLastResult(`Sequential dialogs completed for ${name}, age ${age}`);
          addToHistory(`Sequential: ${name}, ${age}, confirmed`);
        } else {
          alert("Please try again!");
          setLastResult("Sequential dialogs cancelled at confirmation");
          addToHistory("Sequential: cancelled at confirmation");
        }
      } else {
        setLastResult("Sequential dialogs cancelled at age prompt");
        addToHistory("Sequential: cancelled at age");
      }
    } else {
      setLastResult("Sequential dialogs cancelled at name prompt");
      addToHistory("Sequential: cancelled at name");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>JavaScript Dialogs Testing</h1>
      <p>This page demonstrates native browser dialog functions: alert(), confirm(), and prompt().</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Basic Dialog Types</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          
          <div style={{ padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #0070f3' }}>
            <h3>Alert Dialog</h3>
            <p>Shows a message with an OK button</p>
            <button 
              onClick={handleAlert}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Show Alert
            </button>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '1px solid #ffc107' }}>
            <h3>Confirm Dialog</h3>
            <p>Shows a question with OK/Cancel buttons</p>
            <button 
              onClick={handleConfirm}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Show Confirm
            </button>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#f3e5f5', borderRadius: '8px', border: '1px solid #9c27b0' }}>
            <h3>Prompt Dialog</h3>
            <p>Asks for user input with OK/Cancel</p>
            <button 
              onClick={handlePrompt}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Show Prompt
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Advanced Dialog Testing</h2>
        
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
          <h3>Custom Alert Message</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              id="customMessage"
              type="text" 
              placeholder="Enter custom message"
              defaultValue="Hello from custom alert!"
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flexGrow: 1,
                minWidth: '200px'
              }}
            />
            <button 
              onClick={handleCustomPrompt}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Show Custom Alert
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#ffebee', borderRadius: '8px' }}>
          <h3>Sequential Dialogs</h3>
          <p>Test multiple dialogs in sequence with data flow</p>
          <button 
            onClick={handleSequentialDialogs}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Start Sequential Dialog Flow
          </button>
        </div>
      </div>

      {lastResult && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#d4edda', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          <strong>Last Result:</strong> {lastResult}
        </div>
      )}

      {dialogHistory.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Dialog History</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {dialogHistory.map((entry, index) => (
              <div 
                key={index}
                style={{
                  padding: '0.5rem',
                  borderBottom: index < dialogHistory.length - 1 ? '1px solid #dee2e6' : 'none',
                  fontSize: '0.9rem'
                }}
              >
                <span style={{ color: '#6c757d', marginRight: '0.5rem' }}>
                  #{dialogHistory.length - index}
                </span>
                {entry}
              </div>
            ))}
          </div>
          <button
            onClick={() => setDialogHistory([])}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Clear History
          </button>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>Testing Notes</h3>
        <ul>
          <li><strong>Alert:</strong> Displays a message and waits for user acknowledgment</li>
          <li><strong>Confirm:</strong> Returns boolean (true for OK, false for Cancel)</li>
          <li><strong>Prompt:</strong> Returns string (user input) or null (if cancelled)</li>
          <li><strong>Browser Compatibility:</strong> All modern browsers support these dialogs</li>
          <li><strong>User Experience:</strong> These dialogs block script execution until closed</li>
          <li><strong>Styling:</strong> Native dialogs cannot be styled (browser-dependent appearance)</li>
        </ul>

        <h4 style={{ marginTop: '1.5rem' }}>Security Considerations</h4>
        <ul>
          <li>Some browsers may block multiple rapid dialogs</li>
          <li>Users can disable dialog prompts in browser settings</li>
          <li>Always validate and sanitize prompt() input</li>
          <li>Consider modern alternatives like custom modal dialogs for better UX</li>
        </ul>
      </div>
    </div>
  );
}