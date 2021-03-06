import {StyleSheet} from 'react-native';
import theme from '../../theme.style';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: theme.HMARGINS,
    marginRight: theme.HMARGINS,
  },
  greetingContainer: {
    marginTop: theme.VMARGINS * 2,
  },
  greeting: {
    ...theme.HEADER,
  },
  name: {
    ...theme.HEADER,
  },
  text: {
    ...theme.BODY,
  },
  header: {
    ...theme.HEADER2,
    marginTop: theme.VMARGINS,
  },
  book: {
    ...theme.body,
    marginTop: '4pt',
  },
  sectionHeader: {
    paddingTop: theme.VMARGINS,
    backgroundColor: theme.GRAY,
    ...theme.HEADER3,
  },
});
