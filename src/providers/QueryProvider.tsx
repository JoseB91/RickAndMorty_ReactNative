import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from '../utils/queryClient';

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Any initialization logic can go here
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; // Or a loading indicator
  }

  return (
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
};

export default QueryProvider;
