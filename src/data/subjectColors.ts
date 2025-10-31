// Color palette for school subjects (GitHub Primer compatible)

export const subjectColors: Record<string, string> = {
  mathematiques: '#2F81F7', // Blue
  physique: '#8256D0', // Purple
  chimie: '#6E40C9', // Deep purple
  francais: '#D73A49', // Red
  anglais: '#0969DA', // Ocean blue
  histoire: '#8B5D3B', // Brown
  geographie: '#1B7F37', // Green
  svt: '#1A7F37', // Nature green
  philosophie: '#6E5494', // Violet
  sport: '#F85149', // Bright red
  informatique: '#24292F', // Dark gray
  economie: '#0969DA', // Business blue
  arts: '#BC4C00', // Orange
  musique: '#CF222E', // Crimson
  autre: '#656D76' // Neutral gray
};

export interface PriorityConfig {
  bg: string;
  border: string;
  text: string;
  badge: string;
  label: string;
}

export const priorityColors: Record<'urgent' | 'important' | 'normal' | 'optional', PriorityConfig> = {
  urgent: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500',
    label: 'Urgent'
  },
  important: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    badge: 'bg-orange-500',
    label: 'Important'
  },
  normal: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500',
    label: 'Normal'
  },
  optional: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    badge: 'bg-gray-500',
    label: 'Optionnel'
  }
};

export interface StatusConfig {
  bg: string;
  text: string;
  label: string;
}

export const statusColors: Record<'pending' | 'in-progress' | 'completed', StatusConfig> = {
  pending: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    label: 'À faire'
  },
  'in-progress': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    label: 'En cours'
  },
  completed: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    label: 'Terminé'
  }
};

// Helper function to get subject color with fallback
export function getSubjectColor(subject: string): string {
  const normalized = subject.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return subjectColors[normalized] || subjectColors.autre;
}
