import React from 'react';

export default function PelatihanTabs({ activeTW, onSelect, counts = {} }) {
  const TRIWULANS = [
    { id: 1, label: 'Triwulan I', range: 'Jan – Mar' },
    { id: 2, label: 'Triwulan II', range: 'Apr – Jun' },
    { id: 3, label: 'Triwulan III', range: 'Jul – Sep' },
    { id: 4, label: 'Triwulan IV', range: 'Okt – Des' },
  ];

  return (
    <div className="tw-tabs">
      {TRIWULANS.map((tw) => (
        <div 
          key={tw.id}
          className={`tw-tab ${activeTW === tw.id ? 'active' : ''}`}
          onClick={() => onSelect(tw.id)}
        >
          <div className="tw-tab-q">TW {tw.id}</div>
          <div className="tw-tab-label">{tw.label}</div>
          <div className="tw-tab-sub">{tw.range}</div>
          <div className="tw-tab-count">{counts[tw.id] || 0} event</div>
        </div>
      ))}
    </div>
  );
}
