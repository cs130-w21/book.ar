import {Dimensions} from 'react-native';

export default {
  PURPLE: '#788eec',
  BLACK: '#131313',
  WHITE: '#fbfbfb',
  GRAY: '#f2f2f2',

  SWIDTH: Dimensions.get('screen').width,
  SHEIGHT: Dimensions.get('screen').height,
  HMARGINS: 30,
  VMARGINS: 20,

  HEADER: {
    fontWeight: '700',
    fontSize: 32,
  },
  HEADER2: {
    fontWeight: '600',
    fontSize: 24,
  },
  HEADER3: {
    fontWeight: '600',
    fontSize: 20,
  },
  BODY: {
    fontSize: 18,
  }
};