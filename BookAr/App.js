import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Button} from './src/Button';

import * as ImagePicker from './src/image_picker.ts/';
import * as CloudVision from './src/cloud_vision.ts';
export default function App() {
  const [response, setResponse] = React.useState(null);

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          title="Take image"
          onPress={() =>
            ImagePicker.launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                CloudVision.getTextFromImage(response["base64"], setResponse);

              },
            )
          }
        />

        <Button
          title="Select image"
          onPress={() =>
            ImagePicker.launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                CloudVision.getTextFromImage(response["base64"], setResponse);
              },
            )
          }
        />


        <View style={styles.response}>
          <Text>Res: {JSON.stringify(response)}</Text>
        </View>

        {response && (
          <View style={styles.image}>
            <Image
              style={{width: 200, height: 200}}
              source={{uri: response.uri}}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  response: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});