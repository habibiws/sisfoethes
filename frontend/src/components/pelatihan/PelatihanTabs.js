import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PelatihanTabs({ activeTW, onSelect, counts = {}, disabledAllTW = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const TRIWULANS = [
    { id: 1, label: 'Triwulan I', range: 'Jan – Mar' },
    { id: 2, label: 'Triwulan II', range: 'Apr – Jun' },
    { id: 3, label: 'Triwulan III', range: 'Jul – Sep' },
    { id: 4, label: 'Triwulan IV', range: 'Okt – Des' },
    { id: 'all', label: 'Tahun Penuh', range: 'Jan – Des' }
  ];

  const activeData = TRIWULANS.find(t => t.id === activeTW) || TRIWULANS[0];
  const isAllActive = activeData.id === 'all';
  const activeCount = isAllActive 
    ? Object.values(counts).reduce((sum, val) => sum + val, 0)
    : (counts[activeData.id] || 0);

  const handleSelect = (id, isDisabled) => {
    if (!isDisabled) {
      onSelect(id);
      setIsExpanded(false); // Auto-close on mobile after selection
    }
  };

  return (
    <div className={`tw-tabs-wrapper ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Mobile Hero Trigger (Only visible on Mobile via CSS) */}
      <div 
        className="tw-mobile-hero" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="hero-left">
          <div className="hero-title">{isAllActive ? 'Semua Event (Tahun Penuh)' : `Filter: ${activeData.label}`}</div>
          <div className="hero-subtitle">{activeData.range}</div>
        </div>
        <div className="hero-right">
          <div className="hero-badge">{activeCount} event</div>
          <ChevronDown size={22} className="hero-chevron" />
        </div>
      </div>

      <div className="tw-tabs">
        {TRIWULANS.map((tw) => {
          const isAll = tw.id === 'all';
          let count = 0;
          if (isAll) {
            count = Object.values(counts).reduce((sum, val) => sum + val, 0);
          } else {
            count = counts[tw.id] || 0;
          }

          const isDisabled = disabledAllTW && !isAll;
          const isActive = activeTW === tw.id;

          return (
            <div 
              key={tw.id}
              className={`tw-tab ${isActive ? 'active' : ''} ${isAll ? 'tab-all-year' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleSelect(tw.id, isDisabled)}
            >
              <div className="tw-tab-q">{isAll ? 'Full' : `TW ${tw.id}`}</div>
              <div className="tw-tab-label">{tw.label}</div>
              <div className="tw-tab-sub">{tw.range}</div>
              <div className="tw-tab-count">{count} event</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
