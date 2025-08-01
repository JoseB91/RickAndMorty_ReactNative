import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CharacterState {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
}

const STORAGE_KEY = 'rick-and-morty-favorites';

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (id: number) => get().favorites.includes(id),
      addToFavorites: (id: number) => {
        if (!get().favorites.includes(id)) {
          set((state) => ({
            favorites: [...state.favorites, id],
          }));
        }
      },
      removeFromFavorites: (id: number) => {
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },
      toggleFavorite: (id: number) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        isFavorite(id) ? removeFromFavorites(id) : addToFavorites(id);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          // Migration logic if needed when version changes
          return { ...persistedState };
        }
        return persistedState;
      },
    }
  )
);
