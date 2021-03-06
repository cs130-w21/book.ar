import React from 'react';
import {Text, View, SectionList} from 'react-native';
import styles from './styles';

const popular_books = {
  'Action and Adventure': ['Harry Potter and the Phoenix of Fire', 'The Giver'],
  Biographies: ['The Adventure of Arjun and Arjun', "Where's Waldo?"],
  Classics: ['To Kill a Cuckoo', "Over the Mockingbird's Nest"],
  Fantasy: ['Acing the CS 130 Quiz'],
  'Sci-Fi': ['Star Wars', 'The Other Lesser Ones'],
  'Suspense and Thrillers': ['The Effective Engineer', 'Gaang of Four'],
  Cookbooks: ['Ocaml: How to Guarantee Spaghetti Code'],
  Poetry: ['Horton Hears a Seg Fault', 'Oompa Loompa'],
  "I'm a loser who doesn't read": ['9gag.com'],
};

// Home screen provides recommendation based off genres the user prefers
export default function HomeScreen({user, extraData}) {
  const user_genres = extraData?.user?.selectedBooks.map(
    (genre) => genre.label,
  );
  var recommended_books = [];
  var default_books = [];
  for (var genre in popular_books) {
    default_books.push({title: genre, data: popular_books[genre]});
    if (user_genres.includes(genre)) {
      recommended_books.push({title: genre, data: popular_books[genre]});
    }
  }
  recommended_books =
    recommended_books.length == 0 ? default_books : recommended_books;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book Recommendations</Text>
      <SectionList
        sections={recommended_books}
        renderItem={({item}) => <Text style={styles.book}>{item}</Text>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}
