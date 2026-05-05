import React from 'react';

const TRIWULANS = [
  { id: 1, label: 'Triwulan I', range: 'Jan – Mar 2025', count: 3 },
  { id: 2, label: 'Triwulan II', range: 'Apr – Jun 2025', count: 2 },
  { id: 3, label: 'Triwulan III', range: 'Jul – Sep 2025', count: 1 },
  { id: 4, label: 'Triwulan IV', range: 'Okt – Des 2025', count: 0 },
];

export default function PelatihanTabs({ activeTW, onSelect }) {
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
          <div className="tw-tab-count">{tw.count} event</div>
        </div>
      ))}
    </div>
  );
}
