import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, Alert, FlatList, ScrollView, ActivityIndicator, Text, View, SectionList} from 'react-native';
import {getGenres, genre2Labels, getBooksFromGenre, getReadingBooks, removeFromReading,addToPrefs } from '../../utils';
import BookModal from '../SelectScreen/BookModal';
import BookListItem from '../../common/BookListItem/BookListItem';
import styles from './styles';

/**
 * This is the React component which defines the UI for the Home screen in the app.
 *
 * @function HomeScreen
 * @param {Object} props - This is a dictionary of component properties.
 * @namespace
 */
export default function HomeScreen({extraData}) {
  const {name} = extraData?.user;
  const [hour, setHour ] = useState(0);
  const [ greeting, setGreeting ] = useState('Good Evening');
  const [recommendations, setRecommendations] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const getReading = async () => {
    const reading = await getReadingBooks();
    setLoading(false);
    if (reading)
      setReading(reading);
  }

  const getRecs = async () => {
    const genres = await getGenres();
    const recs = await genres.reduce(async (acc, genre) => {
      return [
        ...(await acc),
        { 
          title: genre2Labels[genre],
          data: (await getBooksFromGenre(genre, 2)),
        }
      ]
    }, []);
    setLoading(false);
    setRecommendations(recs);
  }

  // On the initial render, get the current time and list the user's recommended
  // books.
  useEffect(() => {
    setHour((new Date).getHours());

    getReading();
    getRecs();
  }, []);

  // Set the displayed greeting according to the time.
  useEffect(() => {
    if (17 <= hour || hour < 7) {
      setGreeting('Good Evening');
    } else if (7 <= hour && hour < 12) {
      setGreeting('Good Morning');
    } else {
      setGreeting('Good Afternoon');
    }
  }, [hour]);

  const showBookAlert = (book) => {
    Alert.alert(
      'Opinion',
      'Did you like this book?',
      [
        {
          text: 'I\'m not done yet',
          onPress: () => {}
        },
        {
          text: 'No',
          onPress: async () => {
            await removeFromReading(book);
            await getReading();
          },
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            await addToPrefs(book);
            await removeFromReading(book);
            await getReading();
          }
        }
      ]
    );
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getReading().catch((e) => {console.error(e)});
      await getRecs().catch((e) => {console.error(e)});
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  }, []);

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {selectedBook !== null && 
        <BookModal
          showModal={selectedBook !== null}
          book={selectedBook}
          onDismiss={() => {setSelectedBook(null)}}
        />}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting},</Text> 
        <Text style={styles.name}>{name.split(' ')[0]} 👋 </Text>
      </View>
      {loading &&
          <ActivityIndicator style={{margin: 50, transform: [{scale: 2}]}} size='large' color='#ff0000' />}
      {reading?.length > 0 &&
          (<>
            <Text style={styles.header}>Currently Reading</Text>
            <FlatList
              scrollEnabled={false}
              data={reading}
              renderItem={({item}) => (
                <BookListItem
                  book={item}
                  style={{ marginHorizontal: 0 }}
                  onPress={() => {
                    showBookAlert(item)
                  }}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          </>)}
      {recommendations &&
        <><Text style={styles.header}>Book Recommendations</Text>
          <SectionList
            scrollEnabled={false}
            sections={recommendations}
            renderItem={({item}) =>
                (<BookListItem book={item} style={{ marginHorizontal: 0 }} onPress={() => setSelectedBook(item)}/>)}
            renderSectionHeader={({section}) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          /></>}
    </ScrollView>
  );
}
