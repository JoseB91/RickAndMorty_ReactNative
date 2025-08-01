import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure the storage for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (replaces cacheTime in v5+)
      retry: 1,
    },
  },
});

// Create a persister using AsyncStorage
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  },
  key: 'rick-and-morty-cache',
});
