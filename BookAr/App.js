import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen, RegistrationScreen} from './src/screens';
import {firebase} from './src/utils/firebase';
import {decode, encode} from 'base-64';
import HomeTabs from './src/HomeTabs';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  return routeName;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const signOut = () => {
    firebase.auth().signOut().then(() => setUser(null));
  }

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged((userData) => {
      if (userData) {
        usersRef
          .doc(userData.uid)
          .get()
          .then((doc) => {
            const data = doc.data();
            setLoading(false);
            setUser(data);
          })
          .catch((err) => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Home"
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
            })}>
            {(props) => <HomeTabs {...props} extraData={{user, signOut}} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}