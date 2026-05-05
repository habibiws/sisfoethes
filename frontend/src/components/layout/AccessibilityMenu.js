import React, { useState, useEffect, useRef } from 'react';
import { Accessibility, Moon, Sun, Type, Maximize } from 'lucide-react';
import useUiStore from '../../store/uiStore';

export default function AccessibilityMenu({ isSidebarCollapsed }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme, fontSize, setFontSize, displaySize, setDisplaySize } = useUiStore();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const levels = [
    { id: 'xs', label: 'XS' },
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' }
  ];

  return (
    <div className={`accessibility-container ${isExpanded ? 'expanded' : ''}`} ref={menuRef}>
      <button 
        className="sidebar-item acc-toggle" 
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        title="Pengaturan Aksesibilitas"
      >
        <div className="si-icon">
          <Accessibility size={18} />
        </div>
        <span className="si-text">Aksesibilitas</span>
        <span className={`acc-arrow ${isExpanded ? 'right' : ''}`}>▸</span>
      </button>

      {isExpanded && (
        <div className="acc-options animate-slide-right floating">
          {/* Dark Mode Toggle */}
          <div className="acc-option-row">
            <div className="acc-option-label">
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              <span>Mode Gelap</span>
            </div>
            <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
              <div className="toggle-handle"></div>
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="acc-option-col">
            <div className="acc-option-label">
              <Type size={14} />
              <span>Ukuran Teks</span>
            </div>
            <div className="font-selector">
              {levels.map((lvl) => (
                <button 
                  key={lvl.id}
                  className={`font-btn ${fontSize === lvl.id ? 'active' : ''}`}
                  onClick={() => setFontSize(lvl.id)}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display Size Selector */}
          <div className="acc-option-col">
            <div className="acc-option-label">
              <Maximize size={14} />
              <span>Ukuran Layar</span>
            </div>
            <div className="font-selector">
              {levels.map((lvl) => (
                <button 
                  key={lvl.id}
                  className={`font-btn ${displaySize === lvl.id ? 'active' : ''}`}
                  onClick={() => setDisplaySize(lvl.id)}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
