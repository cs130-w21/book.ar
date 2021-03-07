import React from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
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
    <TouchableOpacity
      style={[styles.listItem, props.style]}
      onPress={props.onPress}
      activeOpacity={props.onPress ? 0.2 : 1}
    >
      <Image style={styles.listItemImg} source={{ uri: props.book.coverUrl }} />
      <View style={styles.listItemBody}>
        <Text style={styles.listItemTitle}>{props.book.title}</Text>
        <Text style={styles.listItemSubtitle}>{props.book.author}</Text>
        <Text
          style={styles.listItemBodyText}
          numberOfLines={3}
        >{props.book.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
