import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import SwitchSelector from 'react-native-switch-selector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class StudentFeedbackCard extends Component {
  constructor(props) {
    super(props);
  }

  renderScale = () => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      items.push(
        <View>
          <Text style={styles.active}>{i}</Text>
          <Text style={styles.line}>|</Text>
          <Text style={styles.space} />
        </View>,
      );
    }
    return items;
  };

  render() {
    if (this.props.kind === '0')
      return (
        <View style={styles.grid}>
          <SwitchSelector
            onPress={value => {
              this.props.studentResponses(value);
            }}
            textColor={'#383030'}
            selectedColor={'black'}
            borderColor={'#383030'}
            options={[
              {label: 'Green', value: '0', activeColor: 'green'},
              {label: 'Yellow', value: '1', activeColor: 'yellow'},
              {label: 'Red', value: '2', activeColor: 'red'},
            ]}
          />
        </View>
      );
    else
      return (
        <View style={styles.grid}>
          <View style={styles.row}>
            <Text>Low </Text>
            <Text>High</Text>
          </View>
          <View style={[styles.column]}>{this.renderScale()}</View>
          <MultiSlider
            values={[1]}
            trackStyle={{backgroundColor: '#333'}}
            selectedStyle={{backgroundColor: 'tomato'}}
            sliderLength={Dimensions.window.width / 1.35}
            onValuesChange={value => {
              this.props.studentResponses(value[0]);
            }}
            min={1}
            max={5}
            step={1}
            allowOverlap={false}
            snapped={true}
          />
        </View>
      );
  }
}
const styles = StyleSheet.create({
  grid: {
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 6,
    paddingBottom: 6,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    marginTop: 1,
    paddingTop: 1,
    marginBottom: 2,
    paddingBottom: 2,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10.0,
    elevation: 24,
  },
  left: {
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  listContainer: {
    width: Dimensions.window.width - 10,
    height: Dimensions.window.height / 11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5.0,
    elevation: 24,

    borderColor: '#2697BF',
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 2,
    paddingBottom: 2,
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.window.width / 2.8,

    bottom: -20,
  },
  active: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
  },
  line: {
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
  },
  space: {
    paddingLeft: Dimensions.window.width / 6,
    paddingRight: 0,
  },
  selector: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 25,
    padding: 5,
    marginTop: 5,
    textAlign: 'center',
  },
});
