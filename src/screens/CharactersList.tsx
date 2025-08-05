import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchCharacters } from '../api/characterApi';
import CharacterCard from '../components/CharacterCard';
import { Character } from '../types/character';
import { queryClient } from '../utils/queryClient';

const CHARACTERS_QUERY_KEY = ['characters'];

const CharactersList: React.FC = () => {
  // Prefetch characters data if not in cache
  useEffect(() => {
    const prefetchCharacters = async () => {
      // This will only fetch if the data is not in the cache or is stale
      await queryClient.prefetchQuery({
        queryKey: CHARACTERS_QUERY_KEY,
        queryFn: fetchCharacters,
      });
    };
    
    prefetchCharacters();
  }, []);

  const {
    data: characters = [],
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery<Character[], Error>({
    queryKey: CHARACTERS_QUERY_KEY,
    queryFn: fetchCharacters,
    staleTime: 5 * 60 * 1000, // 5 minutes until data is considered stale
    gcTime: 60 * 60 * 1000, // 1 hour until garbage collection
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Show loading indicator only on initial load, not during background refreshes
  if (isLoading && !isRefetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading characters...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading characters</Text>
        <Text style={styles.errorDetail}>{error?.message}</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => `character-${item.id}`}
      renderItem={({ item }) => {
        return <CharacterCard character={item} />;
      }}
      contentContainerStyle={styles.list}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={11}
      removeClippedSubviews
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>No characters found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 10,
  },
  errorDetail: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryText: {
    color: '#1e88e5',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CharactersList;
