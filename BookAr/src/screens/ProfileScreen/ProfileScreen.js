import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

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