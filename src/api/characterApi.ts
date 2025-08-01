import { Character, CharacterResponse } from '../types/character';

export const CHARACTERS_ENDPOINT = 'https://rickandmortyapi.com/api/character';

export const fetchCharacters = async (): Promise<Character[]> => {
  const response = await fetch(CHARACTERS_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  const data: CharacterResponse = await response.json();
  return data.results;
};