"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface MenuPosition {
  x: number;
  y: number;
}

export default function ContextMenuPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [lastAction, setLastAction] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
    setLastAction(`Right-clicked at position: ${e.clientX}, ${e.clientY}`);
  };

  const handleMenuAction = (action: string) => {
    setLastAction(`Selected: ${action}`);
    setShowMenu(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  useEffect(() => {
    const preventDefaultContextMenu = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventDefaultContextMenu);
    return () => document.removeEventListener('contextmenu', preventDefaultContextMenu);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Back to Home</Link>
      
      <h1>Context Menu Testing</h1>
      <p>This page demonstrates custom right-click context menu functionality.</p>

      <div style={{ marginTop: '2rem' }}>
        <div
          onContextMenu={handleContextMenu}
          style={{
            backgroundColor: '#f0f8ff',
            border: '2px dashed #0070f3',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <h2>Right-Click Test Area</h2>
          <p>Right-click anywhere in this area to see the custom context menu</p>
        </div>

        {lastAction && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>
            <strong>Last Action:</strong> {lastAction}
          </div>
        )}
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '150px'
          }}
        >
          <div
            onClick={() => handleMenuAction('Copy')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            📋 Copy
          </div>
          <div
            onClick={() => handleMenuAction('Paste')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            📄 Paste
          </div>
          <div
            onClick={() => handleMenuAction('Delete')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            🗑️ Delete
          </div>
          <div
            onClick={() => handleMenuAction('Properties')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            ⚙️ Properties
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>Testing Instructions</h3>
        <ol>
          <li>Right-click anywhere in the blue dashed area above</li>
          <li>A custom context menu should appear at your mouse position</li>
          <li>Click on any menu item to see the action logged</li>
          <li>Click outside the menu to close it</li>
          <li>Try right-clicking in different positions to test menu positioning</li>
        </ol>

        <h4 style={{ marginTop: '1.5rem' }}>Implementation Features</h4>
        <ul>
          <li>Prevents default browser context menu</li>
          <li>Custom menu positioning based on mouse coordinates</li>
          <li>Click-outside-to-close functionality</li>
          <li>Hover effects on menu items</li>
          <li>Action logging and feedback</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Additional Test Areas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div
            onContextMenu={handleContextMenu}
            style={{
              backgroundColor: '#ffebee',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #e57373'
            }}
          >
            <strong>Area 1</strong><br />
            Right-click here too
          </div>
          <div
            onContextMenu={handleContextMenu}
            style={{
              backgroundColor: '#e8f5e8',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #81c784'
            }}
          >
            <strong>Area 2</strong><br />
            And here as well
          </div>
        </div>
      </div>
    </div>
  );
}