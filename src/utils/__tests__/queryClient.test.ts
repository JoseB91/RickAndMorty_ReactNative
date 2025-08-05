import { queryClient, asyncStoragePersister } from '../queryClient';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock createAsyncStoragePersister
jest.mock('@tanstack/query-async-storage-persister', () => ({
  createAsyncStoragePersister: jest.fn(),
}));

describe('queryClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('queryClient configuration', () => {
    it('should be an instance of QueryClient', () => {
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should have default options configured', () => {
      expect(queryClient.getDefaultOptions().queries).toEqual({
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 1,
      });
    });
  });

  describe('asyncStoragePersister', () => {
    it('should be created with AsyncStorage', () => {
      expect(createAsyncStoragePersister).toHaveBeenCalledWith({
        storage: {
          getItem: expect.any(Function),
          setItem: expect.any(Function),
          removeItem: expect.any(Function),
        },
        key: 'rick-and-morty-cache',
      });
    });

    it('should use AsyncStorage methods', () => {
      const [[options]] = (createAsyncStoragePersister as jest.Mock).mock.calls;
      
      // Test getItem
      options.storage.getItem('test');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test');
      
      // Test setItem
      options.storage.setItem('test', 'value');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test', 'value');
      
      // Test removeItem
      options.storage.removeItem('test');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test');
    });
  });
});
