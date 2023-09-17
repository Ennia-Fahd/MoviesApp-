import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import FilmItem from './FilmItem'
import FilmDetail from './FilmDetail'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
class Search extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0
    this.totalPages = 0
    this.state = {
      films: [],
      isLoading: false,
      selectedFilm: null // ajout d'une propriété pour stocker le film sélectionné
    }
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({
            films: [ ...this.state.films, ...data.results ],
            isLoading: false
          })
      })
    } else {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText("", this.page+1).then(data => {
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({
            films: [ ...this.state.films, ...data.results ],
            isLoading: false
          })
      })
    }
  }
  

  _searchTextInputChanged(text) {
    this.searchedText = text 
    this.setState({ searchText: text, previousSearch: this.state.searchText })
  }
  

  _searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: [],
    }, () => {
        this._loadFilms()
    })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  displayDetailForFilm = (id) => {
    const selectedFilm = this.state.films.find(film => film.id === id)
    this.setState({ selectedFilm })
  }

  // ajout de la méthode pour revenir à la liste des films
  _goBackToList = () => {
    this.setState({ selectedFilm: null, searchText: this.state.previousSearch })
  }
  
  componentDidMount() {
    this._loadFilms();
  }
  
 
  render() {
    return (
      <View style={styles.main_container}>
        {/* condition pour afficher la barre de recherche uniquement si aucun film n'est sélectionné */}
        {this.state.selectedFilm === null && (
          <>
            <TextInput
              style={styles.textinput}
              placeholder='Titre du film'
              onChangeText={(text) => this._searchTextInputChanged(text)}
              onSubmitEditing={() => this._searchFilms()}
              value={this.state.searchText}
            />
            <Button title='Rechercher' onPress={() => this._searchFilms()}/>
          </>
        )}

        {/* condition pour afficher soit la liste des films, soit le détail du film */}
        {this.state.selectedFilm === null ? (
          <>
            <FlatList
              data={this.state.films}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => <FilmItem film={item}  onPress={this.displayDetailForFilm} />}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                  if (this.page < this.totaldPages) {
                    this._loadFilms()
                    }
                    }}
                    />
                    {this._displayLoading()}
                    </>
                    ) : (
                    <FilmDetail
                    film={this.state.selectedFilm}
                    onClose={() => this.setState({ selectedFilm: null })}
                    />
                    )}
                    </View>
                    )
  }
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 20
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Search
