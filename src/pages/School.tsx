import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SchoolTab } from '../types/school';
import { OverviewTab } from '../components/school/OverviewTab';
import { HomeworkTab } from '../components/school/HomeworkTab';
import { ExamsTab } from '../components/school/ExamsTab';
import { useSchoolData } from '../hooks/useSchoolData';

interface SchoolProps {
  searchQuery: string;
}

export function School({ searchQuery }: SchoolProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SchoolTab>('overview');

  const schoolData = useSchoolData();

  // Calculate badge counts
  const pendingHomeworkCount = useMemo(
    () => schoolData.homework.filter(h => h.status !== 'completed').length,
    [schoolData.homework]
  );

  const upcomingExamsCount = useMemo(() => {
    const now = Date.now();
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    return schoolData.exams.filter(e => {
      const examDate = new Date(e.date).getTime();
      return examDate > now && examDate < now + twoWeeks;
    }).length;
  }, [schoolData.exams]);

  const tabs = [
    {
      id: 'overview' as SchoolTab,
      label: t('school.tabs.overview'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      badge: null
    },
    {
      id: 'homework' as SchoolTab,
      label: t('school.tabs.homework'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : null
    },
    {
      id: 'exams' as SchoolTab,
      label: t('school.tabs.exams'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      badge: upcomingExamsCount > 0 ? upcomingExamsCount : null
    }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation - Horizontal Scrollable on Mobile */}
      <div className="border-b border-gh-border-default overflow-x-auto">
        <div className="flex gap-1 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-3 rounded-t-md
                transition-all duration-200 ease-out whitespace-nowrap
                min-h-[44px] touch-manipulation
                ${
                  activeTab === tab.id
                    ? 'bg-gh-canvas-default text-gh-accent-fg border-b-2 border-gh-accent-emphasis'
                    : 'text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-subtle'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {/* Icon */}
              <div
                className={`
                transition-colors
                ${activeTab === tab.id ? 'text-gh-accent-fg' : 'text-gh-fg-subtle group-hover:text-gh-fg-default'}
              `}
              >
                {tab.icon}
              </div>

              {/* Label */}
              <span className="text-sm font-medium">{tab.label}</span>

              {/* Badge for pending items */}
              {tab.badge !== null && tab.badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-gh-danger-emphasis text-white">
                  {tab.badge}
                </span>
              )}

              {/* Active indicator line */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gh-accent-emphasis" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab searchQuery={searchQuery} schoolData={schoolData} />}
        {activeTab === 'homework' && <HomeworkTab searchQuery={searchQuery} schoolData={schoolData} />}
        {activeTab === 'exams' && <ExamsTab searchQuery={searchQuery} schoolData={schoolData} />}
      </div>
    </div>
  );
}
