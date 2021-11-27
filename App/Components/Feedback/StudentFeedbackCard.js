import React, {Component} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import SwitchSelector from 'react-native-switch-selector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class StudentFeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textResponse1 : ["","",""],
      textResponse2 : ["","",""],
    };
    // this.state = {
    //   studentResponses: [],
    // }
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
  
  createTextInputsQuestion1 = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(
        <TextInput
            key = {i}
            style={styles.textInput}
            multiline={true}
            numberOfLines={2}
            onChangeText = {value => {
              let dupTextResponse1 = [...this.state.textResponse1];
              dupTextResponse1[i] = value;
              this.setState({textResponse1:dupTextResponse1,})
              this.props.studentResponses([dupTextResponse1,this.state.textResponse2]);}}
            placeholder={"Response "+ (i+1)}
            placeholderTextColor = "grey"
            value={this.state.textResponse1[i]}
          />
      );
    }
    return items;
  }
  
  createTextInputsQuestion2 = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(
        <TextInput
            key = {i}
            style={styles.textInput}
            multiline={true}
            numberOfLines={2}
            onChangeText = {value => {
              let dupTextResponse2 = [...this.state.textResponse2];
              dupTextResponse2[i] = value;
              this.setState({textResponse2:dupTextResponse2,})
              this.props.studentResponses([this.state.textResponse1,dupTextResponse2]);}}
            placeholder={"Response "+ (i+1)}
            placeholderTextColor = "grey"
            value={this.state.textResponse2[i]}
          />
      );
    }
    return items;
  }


  render() {
    if (this.props.kind === '0')
      return (
        <View style={styles.grid}>
          <SwitchSelector
            onPress={value => {
              this.props.studentResponses(value);
            }}
            textColor={'#383030'}
            selectedColor={'white'}
            borderColor={'#383030'}
            options={[
              {label: 'Not Much', value: '0', activeColor: '#F3460A'},
              {label: 'Somewhat', value: '1', activeColor: 'orange'},
              {label: 'Completely', value: '2', activeColor: '#60CA24'},
            ]}/>

        </View>
      );
    else if (this.props.kind==='1')
      return (
        <View style={styles.grid}>
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
    else if (this.props.kind==='2')
      return (
        <View style={styles.grid}>
          <Text style={[styles.questions, styles.shadow]}>
            What are the three most important things that you learnt?
          </Text>
          {/* <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={2}
            onChangeText = {value => {
              dupTextResponse1 = [...this.state.textResponse1];
              dupTextResponse1[0] = value;
              this.setState({textResponse1:dupTextResponse1,})
              this.props.studentResponses([dupTextResponse1,this.state.textResponse2]);}}
            placeholder="Response for Question 1"
            placeholderTextColor = "grey"
            value={this.state.textResponse1[0]}
          /> */}
          {this.createTextInputsQuestion1()}
          <Text style={[styles.questions, styles.shadow]}>
            What are the things that remain doubtful?
          </Text>
          {/* <TextInput
            style={styles.textInput}
            placeholder="Response for Question 2"
            multiline={true}
            onChangeText = {value => {
              this.setState({textResponse2:value,})
              this.props.studentResponses([this.state.textResponse1,value]);}}
            numberOfLines={2}
            placeholderTextColor = "grey"
            value={this.state.textResponse2}
          /> */}
          {this.createTextInputsQuestion2()}
        </View>
      );
    else
     return (
       <Text>No feedback</Text>
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
  questions: {
    padding: 10,
    margin: 10,
    backgroundColor : "white",
    borderRadius : 10,
    fontWeight : "bold",
    width: 350,
  },
  textInput: {
    color : 'black',
    width: 325,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
});
