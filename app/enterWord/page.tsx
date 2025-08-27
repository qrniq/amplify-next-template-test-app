"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WordListResponse {
  success?: boolean;
  message?: string;
  word?: string;
  wordList: string[];
  wordCount: number;
  previousCount?: number;
  timestamp: string;
  error?: string;
}

export default function EnterWordPage() {
  const [word, setWord] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const fetchWordList = async () => {
    try {
      const response = await fetch('/api/addWord');
      const data: WordListResponse = await response.json();
      setWordList(data.wordList);
      setWordCount(data.wordCount);
    } catch (err) {
      setError('Failed to fetch word list');
    }
  };

  useEffect(() => {
    fetchWordList();
  }, []);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/addWord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word.trim() }),
      });
      
      const data: WordListResponse = await response.json();
      
      if (data.success) {
        setMessage(data.message || 'Word added successfully');
        setWord('');
        setWordList(data.wordList);
        setWordCount(data.wordCount);
      } else {
        setError(data.message || 'Failed to add word');
      }
      
    } catch (err) {
      setError('Failed to add word');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWordList = async () => {
    if (!confirm('Are you sure you want to reset the word list? This will remove all words.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/resetWordList', {
        method: 'POST',
      });
      
      const data: WordListResponse = await response.json();
      
      if (data.success) {
        setMessage(data.message || 'Word list reset successfully');
        setWordList([]);
        setWordCount(0);
      } else {
        setError(data.message || 'Failed to reset word list');
      }
      
    } catch (err) {
      setError('Failed to reset word list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleWords = async () => {
    const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];
    setLoading(true);
    
    for (const sampleWord of sampleWords) {
      try {
        await fetch('/api/addWord', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ word: sampleWord }),
        });
      } catch (err) {
        // Continue with other words even if one fails
      }
    }
    
    await fetchWordList();
    setMessage(`Added sample words to the list`);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>Word Management System</h1>
      <p>Add, manage, and reset an in-memory word list. This demonstrates server-side state management.</p>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2>Add New Word</h2>
          <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Enter Word:
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter a word..."
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !word.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Adding...' : 'Add Word'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleAddSampleWords}
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
            Add Sample Words
          </button>
          <button
            onClick={handleResetWordList}
            disabled={loading || wordCount === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading || wordCount === 0 ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || wordCount === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Reset Word List
          </button>
          <button
            onClick={fetchWordList}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Refresh List
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '1rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Current Word List</h2>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: '#007bff', 
              color: 'white', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              {wordCount} words
            </span>
          </div>
          
          {wordList.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
              No words in the list yet. Add some words above!
            </p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '0.5rem'
            }}>
              {wordList.map((wordItem, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}
                >
                  {wordItem}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>Word Management API Testing</h3>
        <p>
          This page demonstrates CRUD operations on an in-memory word list stored on the server.
          The word list persists across requests but will be reset when the server restarts.
        </p>
        
        <h4>Available API Endpoints:</h4>
        <ul>
          <li><code>POST /api/addWord</code> - Add a word to the list</li>
          <li><code>GET /api/addWord</code> - Get current word list</li>
          <li><code>POST /api/resetWordList</code> - Clear all words</li>
          <li><code>GET /api/resetWordList</code> - Clear all words (alternative)</li>
        </ul>

        <h4>Features Demonstrated:</h4>
        <ul>
          <li><strong>Server-side State:</strong> Word list maintained in server memory</li>
          <li><strong>Duplicate Prevention:</strong> Same word cannot be added twice</li>
          <li><strong>Input Validation:</strong> Empty and invalid words are rejected</li>
          <li><strong>RESTful API:</strong> Proper HTTP methods and response codes</li>
          <li><strong>Error Handling:</strong> Comprehensive error messages and status codes</li>
        </ul>

        <h4>Test Scenarios:</h4>
        <ul>
          <li>Try adding duplicate words</li>
          <li>Add empty or whitespace-only words</li>
          <li>Add special characters and numbers</li>
          <li>Reset the list and verify it's empty</li>
          <li>Refresh the page and see that words persist</li>
        </ul>
      </div>
    </div>
  );
}