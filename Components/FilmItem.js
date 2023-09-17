import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'

class FilmItem extends React.Component {
  _displayFilmDetail = () => {
    const { film, onPress } = this.props;
    onPress(film.id);
  };

 _displayTrailer = async () => {
  const { film } = this.props;
  const query = `trailer film ${film.title}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=id&&maxResults=5&q=${query}&key=AIzaSyD7jvga4S_1_v_xLr6wp3UG_2IIUTGSqrY`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const videoId = data.items[0].id.videoId;
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  } catch (error) {
    console.log(error);
  }
};


  render() {
    const film = this.props.film
    return (
      <TouchableOpacity style={styles.main_container} onPress={this._displayFilmDetail}>
        <TouchableOpacity onPress={this._displayTrailer}>
          <Image
            style={styles.image}
            source={{uri: getImageFromApi(film.poster_path)}}
          />
        </TouchableOpacity>
        <View style={styles.content_container}>
          <View style={styles.header_container}>
            <Text style={styles.title_text}>{film.title}</Text>
            <Text style={styles.vote_text}>{film.vote_average}</Text>
          </View>
          <View style={styles.description_container}>
            <Text style={styles.description_text} numberOfLines={6}>{film.overview}</Text>
          </View>
          <View style={styles.date_container}>
            <Text style={styles.date_text}>Sorti le {film.release_date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row'
  },
  image: {
    width: 120,
    height: 180,
    margin: 5,
    backgroundColor: 'gray'
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  header_container: {
    flex: 3,
    flexDirection: 'row'
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },
  description_container: {
    flex: 7
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666'
  },
  date_container: {
    flex: 1
  },
  date_text: {
    textAlign: 'right',
    fontSize: 14
  }
})

export default FilmItem
