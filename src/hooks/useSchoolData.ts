import { useState, useEffect, useCallback } from 'react';
import { Homework, Exam, SchoolData } from '../types/school';

const STORAGE_KEY = 'nexus_school_data';

export function useSchoolData() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  // Load data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SchoolData = JSON.parse(saved);
        setHomework(data.homework || []);
        setExams(data.exams || []);
      }
    } catch (error) {
      console.error('Failed to load school data:', error);
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data: Partial<SchoolData>) => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const existing: SchoolData = current ? JSON.parse(current) : { homework: [], exams: [] };

      const updated: SchoolData = {
        homework: data.homework !== undefined ? data.homework : existing.homework,
        exams: data.exams !== undefined ? data.exams : existing.exams
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save school data:', error);
    }
  }, []);

  // Homework operations
  const addHomework = useCallback((hw: Omit<Homework, 'id' | 'createdAt'>) => {
    const newHomework: Homework = {
      ...hw,
      id: `homework-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...homework, newHomework];
    setHomework(updated);
    saveData({ homework: updated });
    return newHomework.id;
  }, [homework, saveData]);

  const updateHomework = useCallback((id: string, updates: Partial<Homework>) => {
    const updated = homework.map(h => {
      if (h.id === id) {
        const updatedItem = { ...h, ...updates };
        // Set completedAt when marking as completed
        if (updates.status === 'completed' && !h.completedAt) {
          updatedItem.completedAt = new Date().toISOString();
        }
        return updatedItem;
      }
      return h;
    });
    setHomework(updated);
    saveData({ homework: updated });
  }, [homework, saveData]);

  const deleteHomework = useCallback((id: string) => {
    const updated = homework.filter(h => h.id !== id);
    setHomework(updated);
    saveData({ homework: updated });
  }, [homework, saveData]);

  // Exam operations
  const addExam = useCallback((exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...exam,
      id: `exam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const updated = [...exams, newExam];
    setExams(updated);
    saveData({ exams: updated });
    return newExam.id;
  }, [exams, saveData]);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    const updated = exams.map(e => e.id === id ? { ...e, ...updates } : e);
    setExams(updated);
    saveData({ exams: updated });
  }, [exams, saveData]);

  const deleteExam = useCallback((id: string) => {
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    saveData({ exams: updated });
  }, [exams, saveData]);

  return {
    // Data
    homework,
    exams,
    // Homework operations
    addHomework,
    updateHomework,
    deleteHomework,
    // Exam operations
    addExam,
    updateExam,
    deleteExam
  };
}
