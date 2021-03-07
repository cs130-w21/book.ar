import React, {useEffect, useState} from 'react';
import {Text, View, SectionList} from 'react-native';
import { genre2Labels, getBooksFromGenre } from '../../utils';
import styles from './styles';

/**
 * This is the React component which defines the UI for the Home screen in the app.
 *
 * @function HomeScreen
 * @param {Object} props - This is a dictionary of component properties.
 * @namespace
 */
export default function HomeScreen({extraData}) {
  const {name, genres} = extraData?.user;
  const [hour, setHour ] = useState(0);
  const [ greeting, setGreeting ] = useState('Good Evening');
  const [recommendations, setRecommendations] = useState(undefined);

  // On the initial render, get the current time and list the user's recommended
  // books.
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
      setRecommendations(recs);
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting}</Text> 
        <Text style={styles.name}>{name.split(' ')[0]} 👋 </Text>
      </View>
      <Text style={styles.header}>Book Recommendations</Text>
      {recommendations &&
          <SectionList
          sections={recommendations}
          renderItem={({item}) => <Text style={styles.book}>{item.title} by {item.author}</Text>}
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
        />}

    </View>
  );
}
