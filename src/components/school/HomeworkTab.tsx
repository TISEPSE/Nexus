import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Homework } from '../../types/school';
import { statusColors } from '../../data/subjectColors';
import { ContextMenu } from '../ContextMenu';

interface HomeworkTabProps {
  searchQuery: string;
  schoolData: any;
}

type FilterStatus = 'all' | 'pending' | 'completed';

export function HomeworkTab({ searchQuery, schoolData }: HomeworkTabProps) {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);

  // Filter homework
  const filteredHomework = useMemo(() => {
    let filtered = schoolData.homework;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((hw: Homework) =>
        hw.title.toLowerCase().includes(query) ||
        hw.subject.toLowerCase().includes(query) ||
        hw.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((hw: Homework) => hw.status === filterStatus);
    }

    // Sort by due date (closest first)
    return filtered.sort((a: Homework, b: Homework) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });
  }, [schoolData.homework, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = schoolData.homework.filter((hw: Homework) => hw.status === 'pending').length;
    const completed = schoolData.homework.filter((hw: Homework) => hw.status === 'completed').length;

    return { pending, completed };
  }, [schoolData.homework]);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="À faire" value={stats.pending} color="orange" />
        <StatCard label="Terminés" value={stats.completed} color="green" />
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 bg-gh-canvas-subtle hover:bg-gh-canvas-inset border border-gh-border-default rounded-md text-sm text-gh-fg-default focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">À faire</option>
            <option value="completed">Terminés</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingHomework(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gh-accent-emphasis text-white rounded-md hover:bg-gh-accent-emphasis/90 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('school.homework.addHomework')}
        </button>
      </div>

      {/* Homework List */}
      {filteredHomework.length === 0 ? (
        <div className="text-center py-12 bg-gh-canvas-subtle border border-gh-border-default rounded-lg">
          <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
            {filterStatus === 'all'
              ? t('school.homework.noHomework')
              : 'Aucun devoir correspondant'}
          </h3>
          <p className="text-sm text-gh-fg-muted">
            {filterStatus === 'all'
              ? t('school.homework.addFirstHomework')
              : 'Essayez de modifier les filtres'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHomework.map((homework: Homework) => (
            <HomeworkCard
              key={homework.id}
              homework={homework}
              onEdit={(hw) => {
                setEditingHomework(hw);
                setShowAddModal(true);
              }}
              onDelete={schoolData.deleteHomework}
              onStatusChange={schoolData.updateHomework}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <HomeworkModal
          homework={editingHomework}
          onClose={() => {
            setShowAddModal(false);
            setEditingHomework(null);
          }}
          onSave={(homework) => {
            if (editingHomework) {
              schoolData.updateHomework(editingHomework.id, homework);
            } else {
              schoolData.addHomework(homework);
            }
            setShowAddModal(false);
            setEditingHomework(null);
          }}
        />
      )}
    </div>
  );
}

// Stat Card
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-0.5">{label}</div>
    </div>
  );
}

// Homework Card Component with 3-dot menu
function HomeworkCard({ homework, onEdit, onDelete, onStatusChange }: {
  homework: Homework;
  onEdit: (homework: Homework) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, updates: Partial<Homework>) => void;
}) {
  const status = statusColors[homework.status];

  // Calculate days until due
  const daysUntil = Math.ceil((new Date(homework.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntil < 0 && homework.status !== 'completed';
  const isDueSoon = daysUntil >= 0 && daysUntil <= 3 && homework.status !== 'completed';

  const handleStatusToggle = () => {
    if (homework.status === 'completed') {
      onStatusChange(homework.id, { status: 'pending' });
    } else {
      onStatusChange(homework.id, { status: 'completed' });
    }
  };

  return (
    <div
      className={`relative bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4 hover:border-gh-accent-fg hover:shadow-md transition-all ${
        homework.status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-all ${
            homework.status === 'completed'
              ? 'bg-green-500 border-green-500'
              : 'border-gh-border-default hover:border-gh-accent-fg'
          }`}
        >
          {homework.status === 'completed' && (
            <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold text-gh-fg-default leading-snug ${homework.status === 'completed' ? 'line-through' : ''}`}>
                {homework.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: homework.subjectColor + '20', color: homework.subjectColor }}
                >
                  {homework.subject}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* 3-Dot Menu */}
            <div className="ml-2">
              <ContextMenu
                items={[
                  {
                    label: 'Modifier',
                    icon: (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    ),
                    onClick: () => onEdit(homework)
                  },
                  {
                    label: 'Supprimer',
                    icon: (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ),
                    onClick: () => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
                        onDelete(homework.id);
                      }
                    },
                    variant: 'danger'
                  }
                ]}
                aria-label="Options du devoir"
              />
            </div>
          </div>

          {/* Description */}
          {homework.description && (
            <p className="text-sm text-gh-fg-default leading-relaxed mb-3">{homework.description}</p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gh-fg-muted">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`whitespace-nowrap ${isOverdue ? 'text-red-400 font-semibold' : isDueSoon ? 'text-orange-400 font-semibold' : ''}`}>
                {new Date(homework.dueDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
                {isOverdue && ' (En retard)'}
                {isDueSoon && !isOverdue && <span className="text-gh-fg-subtle"> ({daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? 'Demain' : `${daysUntil}j`})</span>}
              </span>
            </div>
            {homework.estimatedTime && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{homework.estimatedTime}min</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Homework Modal Component - removed in-progress status option
function HomeworkModal({ homework, onClose, onSave }: {
  homework: Homework | null;
  onClose: () => void;
  onSave: (homework: Omit<Homework, 'id' | 'createdAt' | 'completedAt'>) => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: homework?.title || '',
    subject: homework?.subject || '',
    subjectColor: homework?.subjectColor || '#2F81F7',
    description: homework?.description || '',
    dueDate: homework?.dueDate || new Date().toISOString().split('T')[0],
    status: homework?.status || 'pending' as const,
    estimatedTime: homework?.estimatedTime || undefined
  });

  // Block body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.subject && formData.dueDate) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gh-canvas-default border-b border-gh-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gh-fg-default">
            {homework ? t('school.homework.editHomework') : t('school.homework.addHomework')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gh-canvas-subtle transition-colors"
          >
            <svg className="w-5 h-5 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gh-fg-default mb-1">
              {t('school.homework.title')} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              required
            />
          </div>

          {/* Subject & Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('school.homework.subject')} *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Couleur de la matière
              </label>
              <input
                type="color"
                value={formData.subjectColor}
                onChange={(e) => setFormData(prev => ({ ...prev, subjectColor: e.target.value }))}
                className="w-full h-10 px-1 py-1 bg-gh-canvas-subtle border border-gh-border-default rounded-md cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gh-fg-default mb-1">
              {t('school.homework.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none resize-none"
            />
          </div>

          {/* Due Date & Estimated Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('school.homework.dueDate')} *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Temps estimé (min)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={formData.estimatedTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gh-fg-default mb-1">
              {t('school.homework.status')} *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gh-canvas-subtle hover:bg-gh-canvas-inset border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
            >
              <option value="pending">À faire</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-gh-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gh-border-default rounded-md text-gh-fg-default hover:bg-gh-canvas-subtle transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md hover:bg-gh-accent-emphasis/90 transition-colors font-medium"
            >
              {homework ? t('common.save') : t('common.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
