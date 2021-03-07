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
    flex: 1.7,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden'
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
  loader: {
    alignSelf: 'center',
    transform: [{ scale: 2 }]
  },
  loadingText: {
    alignSelf: 'center',
    fontSize: 16,
    paddingTop: 30,
    fontWeight: 'bold',
    color: '#888',
    textAlign: 'center'
  },
  response: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: '90%',
    height: '80%'
  },
  modalBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#000a'
  },
  modalBook: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  modalBookImg: {
    width: '50%',
    height: '50%',
  },
  modalBookTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: 10
  },
  modalBookSubtitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    color: '#888'
  },
  modalBookBodyText: {
    margin: 10,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  modalButtons: {
    marginTop: 10,
    paddingVertical: 20,
    flex: 0.2,
    textAlign: 'center',
    justifyContent: 'space-around',
    alignItems: 'stretch'
  },
  modalButton: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10
  }
});
