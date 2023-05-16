import React, {Component,useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import SwitchSelector from 'react-native-switch-selector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const StudentFeedbackCard = (props) =>   {
 

  const [state,setState] = useState({
    textResponse1 : ["","",""],
    textResponse2 : ["","",""],
  })

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
        <View style = {styles.grid}>
        <TextInput
            key = {i}
            style={styles.textInput}
            multiline={true}
            numberOfLines={2}
            onChangeText = {value => {
              let dupTextResponse1 = [...state.textResponse1];
              dupTextResponse1[i] = value;
              setState(prevState => ({
                ...prevState,
                textResponse1:dupTextResponse1
              }));
      
              props.studentResponses([dupTextResponse1,state.textResponse2]);}}
            placeholder={"Response "+ (i+1)}
            placeholderTextColor = "grey"
            value={state.textResponse1[i]}
          />
        </View>
      );
    }
    return items;
  }
  
  createTextInputsQuestion2 = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(
        <View style = {styles.grid}>
        <TextInput
            key = {i}
            style={styles.textInput}
            multiline={true}
            numberOfLines={2}
            onChangeText = {value => {
              let dupTextResponse2 = [...state.textResponse2];
              dupTextResponse2[i] = value;
              setState(prevState => ({
                ...prevState,
                textResponse2: dupTextResponse2,
              }))
              
              props.studentResponses([state.textResponse1,dupTextResponse2]);}}
            placeholder={"Response "+ (i+1)}
            placeholderTextColor = "grey"
            value={state.textResponse2[i]}
          />
        </View>
      );
    }
    return items;
  }


  
    if (props.kind === '0')
      return (
        <View style={styles.grid}>
          <SwitchSelector
            onPress={value => {
              props.studentResponses(value);
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
    else if (props.kind==='1')
      return (
        <View style={styles.grid}>
          <View style={styles.row}>
            <Text>Low </Text>
            <Text>High</Text>
          </View>
          <View style={[styles.column]}>{renderScale()}</View>
          <MultiSlider
            values={[1]}
            trackStyle={{backgroundColor: '#333'}}
            selectedStyle={{backgroundColor: 'tomato'}}
            sliderLength={Dimensions.window.width / 1.35}
            onValuesChange={value => {
              props.studentResponses(value[0]);
            }}
            min={1}
            max={5}
            step={1}
            allowOverlap={false}
            snapped={true}
          />
        </View>
      );
    else if (props.kind==='2')
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
              dupTextResponse1 = [...state.textResponse1];
              dupTextResponse1[0] = value;
              setState({textResponse1:dupTextResponse1,})
              props.studentResponses([dupTextResponse1,state.textResponse2]);}}
            placeholder="Response for Question 1"
            placeholderTextColor = "grey"
            value={state.textResponse1[0]}
          /> */}
          {createTextInputsQuestion1()}
          <Text style={[styles.questions, styles.shadow]}>
            What are the things that remain doubtful?
          </Text>
          {/* <TextInput
            style={styles.textInput}
            placeholder="Response for Question 2"
            multiline={true}
            onChangeText = {value => {
              setState({textResponse2:value,})
              props.studentResponses([state.textResponse1,value]);}}
            numberOfLines={2}
            placeholderTextColor = "grey"
            value={state.textResponse2}
          /> */}
          {createTextInputsQuestion2()}
        </View>
      );
    else
     return (
       <Text>No feedback</Text>
      );
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

export default StudentFeedbackCard;