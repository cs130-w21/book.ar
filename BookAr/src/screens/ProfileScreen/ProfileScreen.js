import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

/**
 * This is the React component which defines the UI for the User Profile screen in the app.
 *
 * @function ProfileScreen
 * @param {Object} props - This is a dictionary of component properties.
 * @namespace
 */
export default function ProfileScreen({ navigation, extraData }) {
  const { user, signOut } = extraData;

  return (
    <View>
      <Text>Profile Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signOut()}
      >
        <Text style={styles.buttonTitle} >Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
