import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

export default class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: ['A', 'B', 'C', 'D'],
    };
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.values.map((value, i) => (
          <Avatar
            key={i}
            size="large"
            icon={
              this.props.icon === value
                ? {name: 'check', color: 'white', type: 'font-awesome'}
                : {}
            }
            title={this.props.icon === value ? '' : value}
            titleStyle={{fontSize: 24, fontWeight: 'bold'}}
            overlayContainerStyle={
              this.props.icon === value
                ? {backgroundColor: '#118040'}
                : {backgroundColor: '#333'}
            }
            onPress={() => {
              this.props.optionValue(value);
            }}
            rounded
            activeOpacity={0.7}
            avatarStyle={styles.avatarStyle}
            containerStyle={styles.avatarContainer}
          />
        ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  avatarStyle: {
    flex: 2,
    borderTopLeftRadius: 1,
  },
  avatarContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.0,
    elevation: 24,
  },
});
