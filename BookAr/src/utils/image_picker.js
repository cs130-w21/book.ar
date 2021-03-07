/**
 * @namespace ImagePicker
 */

import {NativeModules} from 'react-native';

/**
 * @typedef {Object} Options - An object which defines the options to be used in camera processing.
 * @property {string}  mediaType - Type of media
 * @property {string}  videoQuality - Quality of media being captured
 * @property {number}  quality - Quality of media being processed
 * @property {number}  maxWidth - Maximum width of media
 * @property {number}  maxHeight - Maximum width of media
 * @property {boolean} includeBase64 - Whether or not to include the Base64
 *                                     encoding of the media.
 * @property {boolean} saveToPhotos - Whether to save the captured media to the
 *                                    user's device.
 * @property {number}  durationLimit - The maximum capture duration (0 = no limit).
 */


/**
 * @constant
 * @type {Options}
 * @memberof ImagePicker
 * @default
 */
const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  videoQuality: 'high',
  quality: 1,
  maxWidth: 0,
  maxHeight: 0,
  includeBase64: false,
  saveToPhotos: false,
  durationLimit: 0,
};

/**
 * This function requests the user's device to use its camera.
 *
 * @function launchCamera
 * @param {Options} options - The options to pass to camera processing.
 * @param {function} callback - An arbitrary callback to use after launching the camera.
 * @memberof ImagePicker
 */
export function launchCamera(options, callback) {
  if (typeof callback !== 'function') {
    console.error('Send proper callback function, check API');
    return;
  }

  NativeModules.ImagePickerManager.launchCamera(
    {...DEFAULT_OPTIONS, ...options},
    callback,
  );
}

/**
 * This function requests the user's device to use its image library.
 *
 * @function launchCamera
 * @param {Options} options - The options to pass to camera processing.
 * @param {function} callback - An arbitrary callback to use after launching the library.
 * @memberof ImagePicker
 */
export function launchImageLibrary(options, callback) {
  if (typeof callback !== 'function') {
    console.error('Send proper callback function, check API');
    return;
  }
  NativeModules.ImagePickerManager.launchImageLibrary(
    {...DEFAULT_OPTIONS, ...options},
    callback,
  );
}
