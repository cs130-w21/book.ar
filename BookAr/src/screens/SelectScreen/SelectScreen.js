import React, {PureComponent,  useState } from 'react';
import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import * as ImagePicker from '../../utils/image_picker.ts';
import * as CloudVision from '../../utils/cloud_vision.ts';

export default class SelectScreen extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = {image: null, focus: {x: 0.5, y: 0.5}};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          captureAudio={false}
          // ratio={'3:4'}
          // autoFocusPointOfInterest={this.state.focus}
          defaultVideoQuality={RNCamera.Constants.Vid}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          // onTap={(event) => this.setState({focus: {x: event.x, y: event.y}})}
          onDoubleTap={this.takePicture.bind(this)}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
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
                  var words = await CloudVision.getRecommendedBooks(data.base64, null);
                  console.log(words);
                },
              )
            }
            style={styles.capture}>
            <Text> CHOOSE </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {base64: true, pauseAfterCapture: true}; //PAUSE ALLOWS FOR STATIC IMAGE ON SCREEN
      const data = await this.camera.takePictureAsync(options);
      const words = await CloudVision.getRecommendedBooks(data.base64, null);
      console.log(words);
      this.camera.resumePreview(); //CALL THIS TO RESUME PREVIEW / BE ABLE TO TAKE ANOTHER
    }
  };
}
