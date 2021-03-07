import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, FlatList, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import * as ImagePicker from '../../utils/image_picker';
import * as Recommender from '../../utils/recommender';
import BookListItem from '../../common/BookListItem/BookListItem';
import BookModal from './BookModal';

/**
 * This is the React component which defines the UI for the Select screen in the app.
 *
 * @function SelectScreen
 * @param {Object} props - This is a dictionary of component properties.
 * @returns {JSX.Element} A JSX element defining the UI.
 * @namespace
 */
export default function SelectScreen({ navigation, extraData }) {
  const [ focus, setFocus ] = useState({x: 0.5, y: 0.5});
  const [ snapBtnText, setSnapBtnText ] = useState('SNAP');
  const [ recBooks, setRecBooks ] = useState(null);
  const [ loading, setLoading ] = useState({ isLoading: false, msg: "loading stuff" });
  const [ selectedBook, setSelectedBook ] = useState(null);

  // const cameraRef = useRef(null);
  const pictureTakenRef = useRef(false);

  /**
   * This function takes a picture using the user's camera and calls our function to recommend books.
   *
   * @async
   * @function takePicture
   * @param {Object} camera - A reference to the camera being used.
   * @memberof SelectScreen
   * @inner
   */
  const takePicture = async (camera) => {
    if (camera && pictureTakenRef.current == false) {
      pictureTakenRef.current = !(pictureTakenRef.current);
      const options = {base64: true, quality: 1, pauseAfterCapture: true}; //PAUSE ALLOWS FOR STATIC IMAGE ON SCREEN
      const data = await camera.takePictureAsync(options);
      setSnapBtnText('AGAIN');
      Recommender.getRecommendedBooks(data.base64, setRecBooks, setLoading)
        .catch(ex => {
          console.error(ex);
          setLoading({ isLoading: false, msg: "" });
          setRecBooks([]);
        });
    } else if(camera){
      pictureTakenRef.current = !(pictureTakenRef.current);
      camera.resumePreview(); //CALL THIS TO RESUME PREVIEW / BE ABLE TO TAKE ANOTHER
      setSnapBtnText('SNAP');
      setRecBooks(null);
    }
  };

  /**
   * This function defines which component to display beneath the camera on the Select screen
   * based on the value of the state variables corresponding to loading and recommended books.
   *
   * @function renderBottom
   * @memberof SelectScreen
   * @inner
   */
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
        renderItem={({item}) => (
          <BookListItem
            id={item.title}
            book={item}
            onPress={() => { setSelectedBook(item) }}
          />
        )}
      />)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {selectedBook !== null && 
        <BookModal
          showModal={selectedBook !== null}
          book={selectedBook}
          onDismiss={() => {setSelectedBook(null)}}
        />}
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
                      Recommender.getRecommendedBooks(data.base64, setRecBooks, setLoading);
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
