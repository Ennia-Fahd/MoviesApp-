import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FilmDetail = ({ film, onClose }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function loadLikedState() {
      const storedLikedState = await AsyncStorage.getItem(`liked-${film.id}`);
      setLiked(storedLikedState !== null);
    }
    loadLikedState();
  }, [film.id]);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
  
    // Vérifier si la clé existe déjà avant d'enregistrer l'état de "like"
    const storedLikedState = await AsyncStorage.getItem(`liked-${film.id}`);
    if (storedLikedState !== null) {
      await AsyncStorage.removeItem(`liked-${film.id}`);
    }
  
    if (newLikedState) {
      await AsyncStorage.setItem(`liked-${film.id}`, JSON.stringify(newLikedState));
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${film.poster_path}` }} style={styles.poster} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{film.title}</Text>
            <Text style={styles.releaseDate}>{new Date(film.release_date).toLocaleDateString()}</Text>
            <Text style={styles.popularity}>Popularité: {film.popularity}</Text>
            <Text style={styles.voteCount}>Vote Total: {film.vote_count}</Text>
          </View>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Icon name={liked ? 'heart' : 'heart-o'} size={24} color={liked ? 'red' : 'black'} style={styles.likeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.overview}>{film.overview}</Text>
          <Button title="Retour" onPress={onClose} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  titleContainer: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
  },
  popularity: {
    fontSize: 16,
    color: '#666',
  },
  voteCount: {
    fontSize: 16,
    color: '#666',
  },
  body: {
    padding: 20,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  likeButton: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  likeIcon: {
    marginRight: 10,
  },
});

export default FilmDetail;
