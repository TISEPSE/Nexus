import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface OverviewTabProps {
  searchQuery: string;
  schoolData: any;
}

export function OverviewTab({ searchQuery, schoolData }: OverviewTabProps) {
  const { t } = useTranslation();

  // Calculate stats
  const pendingHomeworkCount = useMemo(
    () => schoolData.homework.filter((h: any) => h.status !== 'completed').length,
    [schoolData.homework]
  );

  const upcomingExamsCount = useMemo(() => {
    const now = Date.now();
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    return schoolData.exams.filter((e: any) => {
      const examDate = new Date(e.date).getTime();
      return examDate > now && examDate < now + twoWeeks;
    }).length;
  }, [schoolData.exams]);

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return schoolData.homework
      .filter((h: any) => {
        const dueDate = new Date(h.dueDate).getTime();
        return h.status !== 'completed' && dueDate > now && dueDate < now + sevenDays;
      })
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [schoolData.homework]);

  return (
    <div className="space-y-4">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title={t('school.overview.pendingHomework')}
          value={pendingHomeworkCount}
          color="orange"
          urgent={pendingHomeworkCount > 5}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          title={t('school.overview.upcomingExams')}
          value={upcomingExamsCount}
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gh-fg-default mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-gh-danger-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('school.overview.upcomingDeadlines')}
          </h3>
          <div className="space-y-2">
            {upcomingDeadlines.map((homework: any) => {
              const daysUntil = Math.ceil((new Date(homework.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={homework.id}
                  className="flex items-center justify-between p-3 bg-gh-canvas-default border border-gh-border-default rounded-md hover:border-gh-accent-fg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gh-fg-default truncate">{homework.title}</h4>
                    <p className="text-xs text-gh-fg-muted">{homework.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      daysUntil <= 1 ? 'bg-red-500/20 text-red-400' :
                      daysUntil <= 3 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {daysUntil === 0 ? 'Aujourd\'hui' : daysUntil === 1 ? 'Demain' : `${daysUntil}j`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingHomeworkCount === 0 && upcomingExamsCount === 0 && (
        <div className="text-center py-12 bg-gh-canvas-subtle border border-gh-border-default rounded-lg">
          <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
            Tout est à jour !
          </h3>
          <p className="text-sm text-gh-fg-muted">
            Aucun devoir ou examen à venir. Profitez de votre temps libre !
          </p>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'orange' | 'red' | 'green';
  urgent?: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, color, urgent, icon }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400'
  };

  return (
    <div
      className={`
      relative bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4
      hover:shadow-md transition-shadow duration-200
      ${urgent ? 'ring-2 ring-gh-danger-emphasis ring-offset-2 ring-offset-gh-canvas-default' : ''}
    `}
    >
      {/* Icon Container */}
      <div className={`inline-flex p-2 rounded-md ${colorClasses[color]} mb-2`}>
        {icon}
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-gh-fg-default">{value}</div>

      {/* Title */}
      <div className="text-xs text-gh-fg-muted mt-1">{title}</div>

      {/* Urgent Badge */}
      {urgent && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gh-danger-emphasis text-white">
            Urgent
          </span>
        </div>
      )}
    </div>
  );
}
