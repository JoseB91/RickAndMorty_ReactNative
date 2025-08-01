import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
  onPress?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
  const renderImage = useCallback(() => (
    <Image
      source={{ uri: character.image }}
      style={styles.image}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      recyclingKey={`character-${character.id}`}
      placeholder={require('../../assets/images/icon.png')} // Fallback to app icon
      onError={(error) => console.error('Image load error:', error)}
    />
  ), [character.image, character.id]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {renderImage()}
          </View>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {character.name}
            </Text>
            <Text style={styles.info} numberOfLines={1}>
              <Text style={styles.label}>Origin: </Text>
              {character.origin.name}
            </Text>
            <Text style={styles.info} numberOfLines={1}>
              <Text style={styles.label}>Location: </Text>
              {character.location.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 60,
    height: 60,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  info: {
    fontSize: 14,
    color: '#4a4a4a',
    marginBottom: 3,
    lineHeight: 18,
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
  }
});

export default React.memo(CharacterCard);
