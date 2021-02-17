import { StyleSheet } from 'react-native';
import theme from '../../theme.style';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    backgroundColor: theme.PURPLE,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: theme.WHITE,
    fontSize: 16,
    fontWeight: "bold"
  },
});