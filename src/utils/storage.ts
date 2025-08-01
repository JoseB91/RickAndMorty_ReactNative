import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@rick_and_morty_favorites';

export const loadFavorites = async (): Promise<number[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const saveFavorites = async (favorites: number[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};
