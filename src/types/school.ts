// Types for the school management section

export interface Homework {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  description: string;
  dueDate: string; // ISO date string
  priority: 'urgent' | 'important' | 'normal' | 'optional';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime?: number; // in minutes
  attachments?: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  date: string; // ISO date string
  time?: string; // Format: "HH:MM"
  duration?: number; // in minutes
  room?: string;
  type: 'exam' | 'test' | 'quiz' | 'oral' | 'practical';
  topics?: string[];
  notes?: string;
}

export type SchoolTab = 'overview' | 'homework' | 'exams';

export interface SchoolData {
  homework: Homework[];
  exams: Exam[];
}
