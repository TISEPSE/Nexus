import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Exam } from '../../types/school';
import { ContextMenu } from '../ContextMenu';

interface ExamsTabProps {
  searchQuery: string;
  schoolData: any;
}

type FilterType = 'all' | 'exam' | 'test' | 'quiz' | 'oral' | 'practical';
type ViewMode = 'list' | 'calendar';

export function ExamsTab({ searchQuery, schoolData }: ExamsTabProps) {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Filter and sort exams
  const filteredExams = useMemo(() => {
    let filtered = schoolData.exams;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((exam: Exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query) ||
        exam.room?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((exam: Exam) => exam.type === filterType);
    }

    // Sort by date (closest first)
    return filtered.sort((a: Exam, b: Exam) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [schoolData.exams, searchQuery, filterType]);

  // Separate upcoming and past exams
  const { upcomingExams, pastExams } = useMemo(() => {
    const now = Date.now();
    const upcoming: Exam[] = [];
    const past: Exam[] = [];

    filteredExams.forEach((exam: Exam) => {
      if (new Date(exam.date).getTime() >= now) {
        upcoming.push(exam);
      } else {
        past.push(exam);
      }
    });

    return { upcomingExams: upcoming, pastExams: past };
  }, [filteredExams]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = schoolData.exams.filter((exam: Exam) => {
      const examTime = new Date(exam.date).getTime();
      return examTime >= now && examTime < now + oneWeek;
    }).length;

    return {
      total: schoolData.exams.length,
      upcoming: upcomingExams.length,
      thisWeek
    };
  }, [schoolData.exams, upcomingExams]);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="À venir" value={stats.upcoming} color="orange" />
        <StatCard label="Cette semaine" value={stats.thisWeek} color="red" />
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 bg-gh-canvas-subtle hover:bg-gh-canvas-inset border border-gh-border-default rounded-md text-sm text-gh-fg-default focus:outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="exam">Examen</option>
            <option value="test">Contrôle</option>
            <option value="quiz">Quiz</option>
            <option value="oral">Oral</option>
            <option value="practical">TP</option>
          </select>

          {/* View Toggle */}
          <div className="inline-flex bg-gh-canvas-subtle border border-gh-border-default rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-gh-canvas-default text-gh-fg-default shadow-sm'
                  : 'text-gh-fg-muted hover:text-gh-fg-default'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-gh-canvas-default text-gh-fg-default shadow-sm'
                  : 'text-gh-fg-muted hover:text-gh-fg-default'
              }`}
            >
              Calendrier
            </button>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingExam(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gh-accent-emphasis text-white rounded-md hover:bg-gh-accent-emphasis/90 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('school.exams.addExam')}
        </button>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Upcoming Exams */}
          {upcomingExams.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Examens à venir ({upcomingExams.length})
              </h3>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onEdit={(e) => {
                      setEditingExam(e);
                      setShowAddModal(true);
                    }}
                    onDelete={schoolData.deleteExam}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Exams */}
          {pastExams.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gh-fg-muted mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Examens passés ({pastExams.length})
              </h3>
              <div className="space-y-3 opacity-60">
                {pastExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onEdit={(e) => {
                      setEditingExam(e);
                      setShowAddModal(true);
                    }}
                    onDelete={schoolData.deleteExam}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {upcomingExams.length === 0 && pastExams.length === 0 && (
            <div className="text-center py-12 bg-gh-canvas-subtle border border-gh-border-default rounded-lg">
              <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
                {filterType === 'all' ? t('school.exams.noExams') : 'Aucun examen correspondant'}
              </h3>
              <p className="text-sm text-gh-fg-muted">
                {filterType === 'all' ? t('school.exams.addFirstExam') : 'Essayez de modifier les filtres'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <CalendarView exams={filteredExams} />
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ExamModal
          exam={editingExam}
          onClose={() => {
            setShowAddModal(false);
            setEditingExam(null);
          }}
          onSave={(exam) => {
            if (editingExam) {
              schoolData.updateExam(editingExam.id, exam);
            } else {
              schoolData.addExam(exam);
            }
            setShowAddModal(false);
            setEditingExam(null);
          }}
        />
      )}
    </div>
  );
}

// Stat Card
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className={`p-5 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} hover:border-opacity-40 transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl font-bold tabular-nums">
          {value}
        </div>
      </div>
      <div className="text-sm font-medium opacity-90">
        {label}
      </div>
    </div>
  );
}

// Exam Card Component
function ExamCard({ exam, onEdit, onDelete }: {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
}) {
  // Calculate days until exam
  const daysUntil = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isPast = daysUntil < 0;
  const isToday = daysUntil === 0;
  const isSoon = daysUntil > 0 && daysUntil <= 7;

  const typeLabels: Record<Exam['type'], string> = {
    exam: 'Examen',
    test: 'Contrôle',
    quiz: 'Quiz',
    oral: 'Oral',
    practical: 'TP'
  };

  const typeColors: Record<Exam['type'], string> = {
    exam: 'bg-red-500/10 text-red-400 border-red-500/20',
    test: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    quiz: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    oral: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    practical: 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  return (
    <div className={`bg-gh-canvas-subtle border border-gh-border-default rounded-xl p-6 hover:border-gh-accent-fg hover:shadow-lg transition-all duration-200 ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex gap-4">
        {/* Date Badge - Larger & Clearer */}
        <div className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center font-semibold ${
          isPast ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
          isToday ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          isSoon ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
            {new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}
          </div>
          <div className="text-3xl font-bold leading-none mt-1">
            {new Date(exam.date).getDate()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-lg font-semibold text-gh-fg-default truncate">
                {exam.title}
              </h3>

              {/* Badges row - better spacing */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: exam.subjectColor + '20', color: exam.subjectColor }}
                >
                  {exam.subject}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${typeColors[exam.type]}`}>
                  {typeLabels[exam.type]}
                </span>
                {!isPast && (
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    isToday ? 'bg-red-500/20 text-red-400' :
                    isSoon ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isToday ? "Aujourd'hui" : daysUntil === 1 ? 'Demain' : `${daysUntil}j`}
                  </span>
                )}
              </div>
            </div>

            {/* 3-Dot Menu */}
            <ContextMenu
              items={[
                {
                  label: 'Modifier',
                  icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                  onClick: () => onEdit(exam)
                },
                {
                  label: 'Supprimer',
                  icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  onClick: () => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
                      onDelete(exam.id);
                    }
                  },
                  variant: 'danger'
                }
              ]}
              aria-label="Options de l'examen"
            />
          </div>

          {/* Details - More spacing */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gh-fg-muted">
            {exam.time && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{exam.time}</span>
              </div>
            )}
            {exam.duration && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{exam.duration}min</span>
              </div>
            )}
            {exam.room && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{exam.room}</span>
              </div>
            )}
          </div>

          {/* Topics - Better layout */}
          {exam.topics && exam.topics.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wide">
                Chapitres à réviser
              </div>
              <div className="flex flex-wrap gap-2">
                {exam.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 bg-gh-canvas-default border border-gh-border-default rounded-md font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {exam.notes && (
            <p className="text-sm text-gh-fg-muted italic leading-relaxed">{exam.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Calendar View (simplified)
function CalendarView({ exams }: { exams: Exam[] }) {
  return (
    <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-8 text-center">
      <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4">
        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
        Vue calendrier
      </h3>
      <p className="text-sm text-gh-fg-muted">
        La vue calendrier complète sera disponible dans une prochaine version
      </p>
    </div>
  );
}

// Exam Modal Component
function ExamModal({ exam, onClose, onSave }: {
  exam: Exam | null;
  onClose: () => void;
  onSave: (exam: Omit<Exam, 'id'>) => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: exam?.title || '',
    subject: exam?.subject || '',
    subjectColor: exam?.subjectColor || '#2F81F7',
    date: exam?.date || new Date().toISOString().split('T')[0],
    time: exam?.time || '',
    duration: exam?.duration,
    room: exam?.room || '',
    type: exam?.type || 'exam' as const,
    topics: exam?.topics?.join(', ') || '',
    notes: exam?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.subject && formData.date) {
      onSave({
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gh-canvas-default border-b border-gh-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gh-fg-default">
            {exam ? t('school.exams.editExam') : t('school.exams.addExam')}
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
              {t('school.exams.title')} *
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
                {t('school.exams.subject')} *
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

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('school.exams.date')} *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Heure
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Durée (min)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              />
            </div>
          </div>

          {/* Type & Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle hover:bg-gh-canvas-inset border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              >
                <option value="exam">Examen</option>
                <option value="test">Contrôle</option>
                <option value="quiz">Quiz</option>
                <option value="oral">Oral</option>
                <option value="practical">TP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Salle
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
                placeholder="ex: A101"
              />
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-gh-fg-default mb-1">
              Chapitres à réviser (séparés par des virgules)
            </label>
            <input
              type="text"
              value={formData.topics}
              onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
              className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none"
              placeholder="Chapitre 1, Chapitre 2, Chapitre 3"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gh-fg-default mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none resize-none"
              placeholder="Notes personnelles..."
            />
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
              {exam ? t('common.save') : t('common.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
