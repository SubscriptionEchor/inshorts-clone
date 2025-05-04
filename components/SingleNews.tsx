import React from 'react';
import { 
  Dimensions, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { Linking } from 'react-native';
import { format, parseISO } from 'date-fns';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type NewsItem = {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  content: string;
  url: string;
};

type SingleNewsProps = {
  item: NewsItem;
  index: number;
  darkTheme: boolean;
};

const SingleNews = ({ item, index, darkTheme }: SingleNewsProps) => {
  const date = parseISO(item?.publishedAt);
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: item?.urlToImage }}
        onError={(err) => console.error("Error Setting Image URI: ", err.nativeEvent.error)}
      />
      <View style={{ ...styles.description, backgroundColor: darkTheme ? '#282c35' : 'white' }}>
        <Text style={{ ...styles.title, color: darkTheme ? 'white' : 'gray' }}>{item?.title}</Text>
        <Text style={{ ...styles.content, color: darkTheme ? 'white' : 'gray' }}>{item?.description}</Text>
        <Text style={{ ...styles.content, color: darkTheme ? 'white' : 'gray' }}>
          {formattedDate}
        </Text>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: windowWidth,
      }}>
        <View style={styles.credit}>
          <Text style={{ ...styles.source, color: darkTheme ? 'white' : 'gray' }}>Shot by </Text>
          <Text style={{ ...styles.source, color: darkTheme ? 'white' : 'gray' }}>{item.author ?? "unknown"}</Text>
        </View>
      </View>
      <ImageBackground
        blurRadius={30}
        source={{ uri: item.urlToImage }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={{
            padding: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: "100%",
          }}
          onPress={() => Linking.openURL(item?.url)}
        >
          <Text style={{ fontSize: 15, color: darkTheme ? 'white' : 'gray' }}>
            {item?.content?.slice(0, 45)}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: darkTheme ? 'white' : 'gray' }}>
            Read More
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default SingleNews;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    padding: 10,
    gap: 10,
  },
  image: {
    width: windowWidth,
    height: '40%',
    borderRadius: 5,
    marginTop: 10,
    resizeMode: 'cover',
    marginRight: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '100'
  },
  content: {
    fontSize: 28,
    fontWeight: '700',
    height: 'auto',
    width: 'auto',
    padding: 7,
    flex: 1,
  },
  description: {
    fontSize: 30,
    fontWeight: '800',
  },
  source: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center'
  },
  credit: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: "center",
    paddingLeft: 12,
  },
  footer: {
    height: 120,
    width: windowWidth,
    position: 'absolute',
    borderRadius: 5,
    bottom: 2,
    backgroundColor: '#d7be69',
    justifyContent: 'center',
    paddingHorizontal: 20,
  }
});
