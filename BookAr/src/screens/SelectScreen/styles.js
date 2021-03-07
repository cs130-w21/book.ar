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
  listItem: {
    flexDirection: 'row',
    height: 150,
    margin: 15,
    backgroundColor: 'white',
    elevation: 2
  },
  listItemImg: {
    height: '100%',
    width: '30%'
  },
  listItemBody: {
    flexDirection: 'column',
    padding: 10,
    width: '70%'
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 18
  },
  listItemSubtitle: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 16
  },
  listItemTitleBodyText: {
  }
});
