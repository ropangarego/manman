import { create } from 'zustand';

export type StudyStep = 'intro' | 'learn' | 'practice' | 'review' | 'summary' | 'unlocks';

interface StudyState {
  step: StudyStep;
  selectedPractice: string | null;
  selectedReview: string | null;
  feedback: string;
  startSession: () => void;
  setStep: (step: StudyStep) => void;
  choosePracticeAnswer: (answer: string) => void;
  chooseReviewAnswer: (answer: string) => void;
  finishReview: () => void;
  resetInteractions: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  step: 'intro',
  selectedPractice: null,
  selectedReview: null,
  feedback: '',
  startSession: () =>
    set({
      step: 'intro',
      selectedPractice: null,
      selectedReview: null,
      feedback: '',
    }),
  setStep: (step) =>
    set({
      step,
      selectedPractice: null,
      selectedReview: null,
      feedback: '',
    }),
  choosePracticeAnswer: (answer) =>
    set({
      selectedPractice: answer,
      feedback: answer === 'hello' ? 'Correct. 你好 means hello.' : 'Almost. Try again - 你好 means hello.',
    }),
  chooseReviewAnswer: (answer) =>
    set((state) => {
      if (state.selectedReview) {
        return state;
      }

      return {
      selectedReview: answer,
      feedback:
        answer === 'go home'
          ? 'Correct. 回家 means go home.'
          : 'Almost. 回家 means go home. We’ll show it again sooner.',
      };
    }),
  finishReview: () =>
    set({
      step: 'summary',
      selectedReview: null,
      feedback: '',
    }),
  resetInteractions: () =>
    set({
      selectedPractice: null,
      selectedReview: null,
      feedback: '',
    }),
}));
