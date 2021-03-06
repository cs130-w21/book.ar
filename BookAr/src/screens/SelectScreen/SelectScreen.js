import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, FlatList, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import * as ImagePicker from '../../utils/image_picker.ts';
import * as CloudVision from '../../utils/cloud_vision.ts';
import BookListItem from './BookListItem.js';

export default function SelectScreen({ navigation, extraData }) {
  const [ focus, setFocus ] = useState({x: 0.5, y: 0.5});
  const [ snapBtnText, setSnapBtnText ] = useState('SNAP');
  const [ recBooks, setRecBooks ] = useState(null);
  const [ loading, setLoading ] = useState({ isLoading: false, msg: "loading stuff" });

  // const cameraRef = useRef(null);
  const pictureTakenRef = useRef(false);

  const takePicture = async (camera) => {
    pictureTakenRef.current = !(pictureTakenRef.current);
    if (camera && pictureTakenRef.current == false) {
      const options = {base64: true, quality: 1, pauseAfterCapture: true}; //PAUSE ALLOWS FOR STATIC IMAGE ON SCREEN
      const data = await camera.takePictureAsync(options);
      setSnapBtnText('AGAIN');
      CloudVision.getRecommendedBooks(data.base64, setRecBooks, setLoading)
        .catch(ex => {
          console.error(ex);
          setLoading({ isLoading: false, msg: "" });
          setRecBooks([]);
        });
    } else if(camera){
      camera.resumePreview(); //CALL THIS TO RESUME PREVIEW / BE ABLE TO TAKE ANOTHER
      setSnapBtnText('SNAP');
      setRecBooks(null);
    }
  };

  const renderBottom = () => {
    if (loading.isLoading) {
      return(
        <View style={[styles.response, { justifyContent: 'center' }]}>
          <ActivityIndicator style={styles.loader} color="#ff0000" size="large" />
          <Text style={styles.loadingText}>{loading.msg}</Text>
        </View>
      );
    } else if (recBooks === null) {
      return (
        <View style={[styles.response, { justifyContent: 'center' }]}>
          <Text style={[ styles.loadingText, { paddingTop: 0 }]}>Take a picture of some books!</Text>
        </View>
      );
    } else if (recBooks.length == 0) {
      return (
        <View style={[styles.response, { justifyContent: 'center' }]}>
          <Text style={[styles.loadingText, { paddingTop: 0 }]}>No good books detected.</Text>
        </View>
      );
    } else {
      return (<FlatList
        style={styles.response}
        data={recBooks}
        renderItem={({item}) => (<BookListItem id={item.title} book={item} />)}
      />)
    }
  }

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
                      CloudVision.getRecommendedBooks(data.base64, setRecBooks);
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
      {renderBottom()}
    </SafeAreaView>
  );
}
