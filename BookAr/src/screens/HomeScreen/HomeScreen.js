import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, Alert, FlatList, ScrollView, ActivityIndicator, Text, View, SectionList} from 'react-native';
import { genre2Labels, getBooksFromGenre, getReadingBooks, removeFromReading,addToPrefs } from '../../utils';
import BookModal from '../SelectScreen/BookModal';
import BookListItem from '../../common/BookListItem/BookListItem';
import styles from './styles';

// Home screen provides recommendation based off genres the user prefers
export default function HomeScreen({extraData}) {
  const {name, genres} = extraData?.user;
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

  useEffect(() => {
    setHour((new Date).getHours());

    const getRecs = async () => {
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

    getReading();
    getRecs();
  }, []);

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
    await getReading();
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
        <Text style={styles.greeting}>{greeting}</Text> 
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
