import { useEffect, useRef, useState } from 'react';
import './IconPicker.css';

// [Material Symbols name, friendly label]
const ICONS = [
  ['task_alt', 'Tick'], ['verified', 'Verified'], ['verified_user', 'Verified shield'], ['shield', 'Shield'],
  ['security', 'Security'], ['health_and_safety', 'Health & safety'], ['favorite', 'Heart'], ['volunteer_activism', 'Care'],
  ['handshake', 'Trust'], ['thumb_up', 'Thumbs up'], ['star', 'Star'], ['workspace_premium', 'Award'],
  ['medical_services', 'Medical'], ['stethoscope', 'Stethoscope'], ['monitor_heart', 'Heart rate'], ['medication', 'Medicine'],
  ['vaccines', 'Injection'], ['bloodtype', 'Blood'], ['clinical_notes', 'Notes'], ['physical_therapy', 'Physiotherapy'],
  ['self_improvement', 'Wellness'], ['elderly', 'Elderly'], ['accessibility_new', 'Accessibility'], ['groups', 'People'],
  ['diversity_3', 'Team'], ['support_agent', 'Support'], ['home', 'Home'], ['home_health', 'Home care'],
  ['schedule', 'Clock'], ['light_mode', 'Day'], ['wb_sunny', 'Sun'], ['dark_mode', 'Night'],
  ['nightlight', 'Moon'], ['call', 'Phone'], ['mail', 'Email'], ['location_on', 'Location'],
  ['healing', 'Healing'], ['bed', 'Bed'], ['local_hospital', 'Hospital'], ['child_care', 'Baby'],
  ['soup_kitchen', 'Cooking'], ['restaurant', 'Meals'],
  ['fitness_center', 'Exercise'], ['sports_gymnastics', 'Stretching'], ['neurology', 'Neurology'],
  ['currency_rupee', 'Rupee'], ['payments', 'Payments'], ['checklist', 'Checklist'],
];

export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  // close when clicking anywhere outside
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const current = ICONS.find(([name]) => name === value);

  return (
    <div className="icon-picker" ref={box}>
      <button type="button" className="icon-picker-btn" onClick={() => setOpen((o) => !o)}>
        <span className="material-symbols-outlined">{value || 'add_circle'}</span>
        <span>{current ? current[1] : value ? 'Custom icon' : 'Choose icon'}</span>
        <span className="material-symbols-outlined icon-picker-caret">expand_more</span>
      </button>
      {open && (
        <div className="icon-picker-pop">
          {ICONS.map(([name, label]) => (
            <button
              type="button" key={name} title={label}
              className={name === value ? 'selected' : ''}
              onClick={() => { onChange(name); setOpen(false); }}
            >
              <span className="material-symbols-outlined">{name}</span>
              <small>{label}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
