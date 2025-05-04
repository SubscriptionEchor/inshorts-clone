import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NewsContext } from '../API/Context';
import { Ionicons } from '@expo/vector-icons';
import SingleNews from './SingleNews';

const Search = () => {
  const { news, darkTheme } = useContext(NewsContext);
  const articles = news?.articles;
  const [searchResults, setSearchResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState({});

  const handleSearch = (text) => {
    if (!text) {
      setSearchResults([]);
      return;
    }
    setSearchResults(articles.filter((q) => q?.title?.includes(text)));
  };

  const handleModal = (n) => {
    setModalVisible(true),
    setCurrentNews(n);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          ...styles.search,
          backgroundColor: darkTheme ? '#444' : 'lightgray',
          color: darkTheme ? 'white' : 'black'
        }}
        onChangeText={(text) => handleSearch(text)}
        placeholder='Search for News'
        placeholderTextColor={darkTheme ? "#aaa" : 'gray'}
      />
      <View style={styles.searchResults}>
        {searchResults.slice(0, 10).map((n) => (
          <TouchableOpacity
            key={n.title}
            activeOpacity={.9}
            onPress={() => handleModal(n)}
          >
            <Text
              style={{
                ...styles.singleResult,
                backgroundColor: darkTheme ? "black" : "white",
                color: darkTheme ? "white" : 'gray'
              }}
            >
              {n.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            position: 'absolute',
            zIndex: 2,
            right: 0,
            margin: 20,
            marginTop: 40
          }}
        >
          <Ionicons name="close-circle" size={30} color={darkTheme ? "white" : "black"} />
        </TouchableOpacity>
        <View
          style={{
            height: '100%',
          }}
        >
          <SingleNews item={currentNews} darkTheme={darkTheme} index={0} />
        </View>
      </Modal>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  search: {
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 15,
  },
  container: {
    width: '100%',
    height: 50,
    position: 'relative'
  },
  searchResults: {
    position: 'absolute',
    zIndex: 1,
    top: 80,
    width: '100%'
  },
  singleResult: {
    borderRadius: 5,
    padding: 10,
    margin: 0.5,
    shadowColor: 'black',
    elevation: 5,
  }
});
