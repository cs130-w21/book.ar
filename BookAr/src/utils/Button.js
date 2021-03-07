/**
 * @namespace Button
 */
import React from 'react';
import {StyleSheet, View, Button as RNButton} from 'react-native';

/**
 * This function returns a button with the required settings
 * @param {Object} param0 - `{title, OnPress, color}`, where 
 * title is the title of the button, OnPress is the click handler and color is the
 * display color of the button 
 * @returns A react native button
 */
export function Button({title, onPress, color}) {
  return (
    <View style={styles.container}>
      <RNButton title={title} onPress={onPress} color={color} />
    </View>
  );
}

/**
 * The sytlesheet for the button
 * @constant
 * @type {Object}
 * @memberof Button
 */
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
});
