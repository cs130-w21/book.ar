import React, {useEffect, useState, useRef} from 'react';
import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import * as ImagePicker from '../../utils/image_picker.ts';
import * as CloudVision from '../../utils/cloud_vision.ts';

export default function SelectScreen({ navigation, extraData }) {
  const [ response, setResponse ] = useState(null);
  const [ focus, setFocus ] = useState({x: 0.5, y: 0.5});
  const [ snapBtnText, setSnapBtnText ] = useState('SNAP');

  // const cameraRef = useRef(null);
  const pictureTakenRef = useRef(false);

  const takePicture = async (camera) => {
    if (camera && pictureTakenRef.current == false) {
      const options = {base64: true, quality: 1, pauseAfterCapture: true}; //PAUSE ALLOWS FOR STATIC IMAGE ON SCREEN
      const data = await camera.takePictureAsync(options);
      setSnapBtnText('AGAIN');
      setResponse('Loading...');
      CloudVision.getRecommendedBooks(data.base64, setResponse);
    } else if(camera){
      camera.resumePreview(); //CALL THIS TO RESUME PREVIEW / BE ABLE TO TAKE ANOTHER
      setSnapBtnText('SNAP');
    }
  };

  useEffect(() => { pictureTakenRef.current = !pictureTakenRef.current}, [ snapBtnText ]);

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        // ref={cameraRef}
        style={styles.preview}
        captureAudio={false}
        // ratio={'3:4'}
        autoFocusPointOfInterest={focus}
        defaultVideoQuality={RNCamera.Constants.Vid}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onTap={(event) => setFocus({x: event.x, y: event.y})}
        // onDoubleTap={() => takePicture(camera)}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status}) => {
          if (status !== 'READY' || !camera ) return <></>;
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                <Text>{snapBtnText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  ImagePicker.launchImageLibrary(
                    {
                      mediaType: 'photo',
                      includeBase64: true,
                      quality: 1,
                    },
                    (data) => {
                      CloudVision.getRecommendedBooks(data.base64, setResponse);
                    },
                  )
                }
                style={styles.capture}>
                <Text> CHOOSE </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
      <View style={styles.response}>
        <Text>Response: {JSON.stringify(response, null, 2)}</Text>
      </View>
    </SafeAreaView>
  );
}
