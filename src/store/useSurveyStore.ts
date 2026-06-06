import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurveyResponse } from '../types';

interface SurveyStore {
  responses: SurveyResponse[];
  addResponse: (response: SurveyResponse) => void;
  clearResponses: () => void;
}

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set) => ({
      responses: [],
      addResponse: (response) =>
        set((state) => ({ responses: [...state.responses, response] })),
      clearResponses: () => set({ responses: [] }),
    }),
    {
      name: 'brc-survey-storage',
    }
  )
);
