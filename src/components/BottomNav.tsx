import type { Tab } from '../types';

interface BottomNavProps {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

const items: { tab: Tab; icon: string; label: string }[] = [
  { tab: 'garden', icon: '❀', label: 'Jardín' },
  { tab: 'today', icon: '✎', label: 'Diario' },
  { tab: 'memories', icon: '☰', label: 'Recuerdos' },
  { tab: 'settings', icon: '⚙︎', label: 'Ajustes' }
];

export function BottomNav({ tab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <button key={item.tab} className={tab === item.tab ? 'nav-item active' : 'nav-item'} onClick={() => onChange(item.tab)}>
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
