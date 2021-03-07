import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '../../utils/firebase';
import styles from './styles';

/**
 * This is the React component which defines the UI for the User Login screen in the app.
 *
 * @function LoginScreen
 * @param {Object} props - This is a dictionary of component properties.
 * @namespace
 */
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * This function triggers a navigation event to navigate to the Registration screen.
   *
   * @function onFooterLinkPress
   * @memberof LoginScreen
   */
  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  /**
   * This function uses the data entered by the user to log into Firebase.
   *
   * @function onLoginPress
   * @memberof LoginScreen
   */
  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        const uid = res.user.uid;
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              alert('User does not exist.');
              return;
            }
            const user = doc.data();
            navigation.navigate('Home', {user});
          })
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
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
