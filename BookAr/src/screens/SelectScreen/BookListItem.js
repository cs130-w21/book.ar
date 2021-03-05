import React from 'react';
import {Image, Text, View} from 'react-native';
import styles from './styles';

/*
 * props: {
 *    book: {
 *      title: string,
 *      description?: string,
 *      isbn?: string,
 *      year?: string,
 *      author?: string,
 *      publisher?: string,
 *      coverUrl?: string
 *    }
 * }
 */
export default function BookListItem(props) {
  return (
    <View style={styles.listItem}>
      <Image style={styles.listItemImg} source={{ uri: props.book.coverUrl }} />
      <View style={styles.listItemBody}>
        <Text style={styles.listItemTitle}>{props.book.title}</Text>
        <Text style={styles.listItemSubtitle}>{props.book.author}</Text>
        <Text
          style={styles.listItemBodyText}
          numberOfLines={3}
        >{props.book.description}</Text>
      </View>
    </View>
  );
}
