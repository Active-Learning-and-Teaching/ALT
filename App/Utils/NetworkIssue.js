import React, {PureComponent} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('window');

class NetworkIssue extends PureComponent {
  state = {
    isConnected: true,
    unsubscribe: null,
  };

  componentDidMount() {
    const subscribe = NetInfo.addEventListener(state => {
      console.log('Connection Type : ', state.type);
      this.setState({isConnected: state.isConnected});
    });
    this.setState({unsubscribe: subscribe});
  }

  componentWillUnmount() {
    this.state.unsubscribe && this.state.unsubscribe();
  }

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={styles.Container}>
        <Text style={styles.Text}>No Internet Connection</Text>
        </View>
      )
    }
    return null;
  }
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'tomato',
    height: '6%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: '6%',
  },
  Text: {color: '#fff'},
});

export default NetworkIssue;
