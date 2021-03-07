import React, { useState, useEffect } from 'react';
import {Text, TouchableOpacity, View } from 'react-native';
import SelectMultiple from 'react-native-select-multiple'
import {labels2Genre,genre2Labels,getGenres} from '../../utils';
import styles from './styles';
import {firebase} from '../../utils/firebase';

export default function ProfileScreen({ navigation, extraData }) {
  const { user, signOut } = extraData;
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [usersGenres, setUsersGenres] = useState([]);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    const populateGenres = async () => {
      const genres = await getGenres();
      const labels = genres.map((genre) => genre2Labels[genre]);
      setSelectedBooks(labels);
      setUsersGenres(labels);
    }

    populateGenres();
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(usersGenres));
    console.log(JSON.stringify(selectedBooks));
    setCanUpdate(JSON.stringify(selectedBooks) != JSON.stringify(usersGenres));
  }, [selectedBooks, usersGenres]);

  const onUpdatePrefs = () => {
    const uid = firebase.auth().currentUser.uid;
    const usersRef = firebase.firestore().collection('users');
    usersRef
      .doc(uid)
      .update('genres', selectedBooks.map((label) => labels2Genre[label]))
      .then(() => {
        setUsersGenres(selectedBooks);
      })
      .catch((err) => alert(err));
  }

  return (
    <View>
      <SelectMultiple
        style={styles.multiselect}
        items={Object.keys(labels2Genre)}
        selectedItems={selectedBooks}
        onSelectionsChange={(books) => setSelectedBooks(books.map(b => b.value))}
      />
      <TouchableOpacity
        style={[styles.button, !canUpdate ? {backgroundColor: '#aaa'} : null]}
        activeOpacity={canUpdate ? 0.2 : 1}
        onPress={() => {
          if (canUpdate) onUpdatePrefs();
        }}>
        <Text style={styles.buttonTitle}>Update Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signOut()}
      >
        <Text style={styles.buttonTitle} >Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
