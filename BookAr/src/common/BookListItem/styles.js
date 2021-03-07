import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
