import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React from 'react';
import { asyncStoragePersister, queryClient } from '../utils/queryClient';

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister: asyncStoragePersister,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }}
  >
    {children}
  </PersistQueryClientProvider>
);

export default QueryProvider;
