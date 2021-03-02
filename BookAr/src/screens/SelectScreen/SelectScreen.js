import React from 'react';
import {Text, View, Image, ScrollView, SafeAreaView} from 'react-native';
import styles from './styles';
import {Button} from '../../utils/Button';
import * as ImagePicker from '../../utils/image_picker.ts';
import * as CloudVision from '../../utils/cloud_vision.ts';

export default function SelectScreen({navigation, extraData}) {
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
                maxHeight: 1024,
                maxWidth: 1024,
              },
              (res) => {
                CloudVision.getTextFromImage(res['base64'], setResponse);
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
                maxHeight: 1024,
                maxWidth: 1024,
              },
              (res) => {
                CloudVision.getTextFromImage(res['base64'], setResponse);
              },
            )
          }
        />

        <View style={styles.response}>
          <Text>Res: {JSON.stringify(response, null, 2)}</Text>
        </View>

        {response && (
          <View style={styles.image}>
            <Image
              style={{width: 1024, height: 1024}}
              source={{uri: response.uri}}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
