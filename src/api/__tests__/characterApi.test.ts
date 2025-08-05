import { fetchCharacters, CHARACTERS_ENDPOINT } from '../characterApi';
import { Character } from '../../types/character';

// Mock the global fetch
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('characterApi', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockFetch.mockClear();
  });

  it('should have the correct endpoint', () => {
    expect(CHARACTERS_ENDPOINT).toBe('https://rickandmortyapi.com/api/character');
  });

  describe('fetchCharacters', () => {
    it('should fetch characters successfully', async () => {
      // Mock data that resembles the API response
      const mockCharacters: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z'
        }
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: mockCharacters })
      };

      mockFetch.mockResolvedValueOnce(mockResponse as any);

      // Call the function
      const result = await fetchCharacters();

      // Assertions
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(CHARACTERS_ENDPOINT);
      expect(result).toEqual(mockCharacters);
    });

    it('should throw an error when the response is not ok', async () => {
      // Mock a failed response
      const errorMessage = 'Network error';
      const mockResponse = {
        ok: false,
        statusText: errorMessage
      };

      mockFetch.mockResolvedValueOnce(mockResponse as any);

      // Assert that the promise is rejected with the correct error message
      await expect(fetchCharacters()).rejects.toThrow('Failed to fetch characters');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(CHARACTERS_ENDPOINT);
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      mockFetch.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchCharacters()).rejects.toThrow(errorMessage);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(CHARACTERS_ENDPOINT);
    });
  });
});
