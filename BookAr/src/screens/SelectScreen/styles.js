import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preview: {
    flex: 0.7,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    fontSize: 14,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  response: {
    flex: 0.3,
    overflow: 'scroll'
  }
});
