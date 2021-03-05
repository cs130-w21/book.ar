import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectMultiple from 'react-native-select-multiple'
import {firebase} from '../../utils/firebase';
import styles from './styles';

export default function RegistrationScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedBooks, setSelectedBooks] = useState('')

  const genres = [
    {label: "Action and Adventure", value: "1569870888"},
    {label: "Biographies", value: "0553296981"},
    {label: "Classics", value: "0446310492"},
    {label: "Fantasy", value: "0345272579"},
    {label: "Sci-Fi", value: "0449212602"},
    {label: "Suspense and Thrillers", value: "0316733741"},
    {label: "Cookbooks", value: "0553233440"},
    {label: "Poetry", value: "0394512731"},
    {label: "I'm a loser who doesn't read", value: "0743222628"},]
  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const uid = res.user.uid;
        const data = {
          id: uid,
          email,
          name,
          selectedBooks
        };

        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .set(data)
          .then(() => navigation.navigate('Home', {user: data}))
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setName(text)}
          value={name}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Text style={styles.text}>Tell Us What Kinds of Books you Like!</Text>
        <SelectMultiple
          style={styles.multiselect}
          items={genres}
          selectedItems={selectedBooks}
          onSelectionsChange={(books) => setSelectedBooks(books)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
