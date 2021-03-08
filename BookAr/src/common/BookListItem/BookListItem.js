import React from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import styles from './styles';

/**
 * This is a React component defining a single item in a FlatList representing a Book.
 *
 * @param {Object} props - This dictionary represents the properties passed to the component.
 * @param {Object} props.book - This represents the book to be displayed in the FlatList item.
 * @namespace BookListItem
 * @memberof SelectScreen
 */
export default function BookListItem(props) {
  return (
    <TouchableOpacity
      style={[styles.listItem, props.style]}
      onPress={props.onPress}
      activeOpacity={props.onPress ? 0.2 : 1}
    >
      <Image style={styles.listItemImg} source={{ uri: props?.book?.coverUrl }} />
      <View style={styles.listItemBody}>
        <Text style={styles.listItemTitle}>{props?.book?.title}</Text>
        <Text style={styles.listItemSubtitle}>{props?.book?.author}</Text>
        <Text
          style={styles.listItemBodyText}
          numberOfLines={3}
        >{props?.book?.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
