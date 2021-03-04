import React, {useState, useRef} from 'react';
import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import * as ImagePicker from '../../utils/image_picker.ts';
import * as CloudVision from '../../utils/cloud_vision.ts';

export default function SelectScreen({ navigation, extraData }) {
  const [ response, setResponse ] = useState(null);
  const [ focus, setFocus ] = useState(null);

  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {base64: true, pauseAfterCapture: true}; //PAUSE ALLOWS FOR STATIC IMAGE ON SCREEN
      const data = await cameraRef.current.takePictureAsync(options);
      setResponse("Loading...");
      CloudVision.getRecommendedBooks(data.base64, setResponse);
      setTimeout(() => {
        cameraRef.current.resumePreview(); //CALL THIS TO RESUME PREVIEW / BE ABLE TO TAKE ANOTHER
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        captureAudio={false}
        // ratio={'3:4'}
        autoFocusPointOfInterest={focus}
        defaultVideoQuality={RNCamera.Constants.Vid}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onTap={(event) => setFocus({x: event.x, y: event.y})}
        onDoubleTap={takePicture}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.capture}>
          <Text> SNAP </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            ImagePicker.launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 1,
              },
              async (data) => {
                const words = await CloudVision.getRecommendedBooks(data.base64, setResponse);
              },
            )
          }
          style={styles.capture}>
          <Text> CHOOSE </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.response}>
        <Text>Response: {JSON.stringify(response, null, 2)}</Text>
      </View>
    </SafeAreaView>
  );
}
