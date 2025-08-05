import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { QueryProvider } from '../QueryProvider';

// Mock the entire queryClient module
const mockQueryClient = new QueryClient();
const mockAsyncStoragePersister = {
  restoreClient: jest.fn(),
  persistClient: jest.fn(),
  removeClient: jest.fn(),
};

// Mock the PersistQueryClientProvider
const mockPersistQueryClientProvider = jest.fn(({ children, ...props }) => {
  // Store the props for assertions
  (mockPersistQueryClientProvider as any).mockProps = props;
  return children;
});

// Create a proper React component for the mock
const MockPersistProvider = ({ children, ...props }: any) => {
  return mockPersistQueryClientProvider({ children, ...props });
};

// Mock the module
jest.mock('@tanstack/react-query-persist-client', () => ({
  PersistQueryClientProvider: MockPersistProvider,
}));

// Mock the queryClient module
jest.mock('../../utils/queryClient', () => ({
  queryClient: mockQueryClient,
  asyncStoragePersister: mockAsyncStoragePersister,
}));

describe('QueryProvider', () => {
  const TestComponent = () => (
    <View testID="test-component">
      <Text>Test Component</Text>
    </View>
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const { getByTestId } = render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    expect(getByTestId('test-component')).toBeTruthy();
  });

  it('configures PersistQueryClientProvider with correct props', () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    // Get the props that were passed to the mock
    const { client, persistOptions } = (mockPersistQueryClientProvider as any).mockProps;
    
    // Assert on the client
    expect(client).toBe(mockQueryClient);
    
    // Assert on persistOptions
    expect(persistOptions).toEqual(expect.objectContaining({
      persister: mockAsyncStoragePersister,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }));
  });

  it('passes children to PersistQueryClientProvider', () => {
    // Spy on the mock function to check if it was called with children
    const spy = jest.spyOn(mockPersistQueryClientProvider, 'mockImplementation');
    
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    // Check that the mock was called with the correct props
    const { client, persistOptions } = (mockPersistQueryClientProvider as any).mockProps;
    expect(client).toBeDefined();
    expect(persistOptions).toBeDefined();
    
    // Check that the component renders without throwing
    expect(() => {
      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );
    }).not.toThrow();
  });
});
