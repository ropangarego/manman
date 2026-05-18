import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StudyStep = 'intro' | 'learn' | 'practice' | 'review' | 'summary' | 'unlocks';
export const STUDY_STORAGE_KEY = 'mandarin-study-position';

interface StudyState {
  step: StudyStep;
  sessionIndex: number;
  learnIndex: number;
  reviewIndex: number;
  sessionCorrect: number;
  sessionAttempts: number;
  selectedPractice: string | null;
  selectedReview: string | null;
  feedback: string;
  setSessionIndex: (sessionIndex: number) => void;
  startSession: () => void;
  startNextSession: () => void;
  setStep: (step: StudyStep) => void;
  choosePracticeAnswer: (
    answer: string,
    correctAnswer: string,
    correctFeedback: string,
    wrongFeedback: string,
  ) => void;
  chooseReviewAnswer: (
    answer: string,
    correctAnswer: string,
    correctFeedback: string,
    wrongFeedback: string,
  ) => void;
  finishPractice: (hasMoreLearnItems: boolean) => void;
  finishReview: (hasMoreReviewItems: boolean) => void;
  resetInteractions: () => void;
  resetStudyProgress: (sessionIndex?: number) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      step: 'intro',
      sessionIndex: 0,
      learnIndex: 0,
      reviewIndex: 0,
      sessionCorrect: 0,
      sessionAttempts: 0,
      selectedPractice: null,
      selectedReview: null,
      feedback: '',
      setSessionIndex: (sessionIndex) =>
        set({
          step: 'intro',
          sessionIndex: Math.max(0, sessionIndex),
          learnIndex: 0,
          reviewIndex: 0,
          sessionCorrect: 0,
          sessionAttempts: 0,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        }),
      startSession: () =>
        set({
          step: 'intro',
          learnIndex: 0,
          reviewIndex: 0,
          sessionCorrect: 0,
          sessionAttempts: 0,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        }),
      startNextSession: () =>
        set((state) => ({
          step: 'intro',
          sessionIndex: state.sessionIndex + 1,
          learnIndex: 0,
          reviewIndex: 0,
          sessionCorrect: 0,
          sessionAttempts: 0,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        })),
      setStep: (step) =>
        set({
          step,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        }),
      choosePracticeAnswer: (answer, correctAnswer, correctFeedback, wrongFeedback) =>
        set((state) => ({
          selectedPractice: answer,
          feedback: answer === correctAnswer ? correctFeedback : wrongFeedback,
          sessionAttempts: state.sessionAttempts + 1,
          sessionCorrect: state.sessionCorrect + (answer === correctAnswer ? 1 : 0),
        })),
      chooseReviewAnswer: (answer, correctAnswer, correctFeedback, wrongFeedback) =>
        set((state) => {
          if (state.selectedReview) {
            return state;
          }

          return {
            selectedReview: answer,
            feedback: answer === correctAnswer ? correctFeedback : wrongFeedback,
            sessionAttempts: state.sessionAttempts + 1,
            sessionCorrect: state.sessionCorrect + (answer === correctAnswer ? 1 : 0),
          };
        }),
      finishPractice: (hasMoreLearnItems) =>
        set((state) => ({
          step: hasMoreLearnItems ? 'learn' : 'review',
          learnIndex: hasMoreLearnItems ? state.learnIndex + 1 : state.learnIndex,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        })),
      finishReview: (hasMoreReviewItems) =>
        set((state) => ({
          step: hasMoreReviewItems ? 'review' : 'summary',
          reviewIndex: hasMoreReviewItems ? state.reviewIndex + 1 : state.reviewIndex,
          selectedReview: null,
          feedback: '',
        })),
      resetInteractions: () =>
        set({
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        }),
      resetStudyProgress: (sessionIndex = 0) =>
        set({
          step: 'intro',
          sessionIndex: Math.max(0, sessionIndex),
          learnIndex: 0,
          reviewIndex: 0,
          sessionCorrect: 0,
          sessionAttempts: 0,
          selectedPractice: null,
          selectedReview: null,
          feedback: '',
        }),
    }),
    {
      name: STUDY_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({ sessionIndex: state.sessionIndex }) as StudyState,
    },
  ),
);
