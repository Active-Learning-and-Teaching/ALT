/* eslint-disable react-native/no-inline-styles */
// Done refactorrrr
import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Animated,
} from 'react-native';
import {Slider, Text, Button, ListItem} from 'react-native-elements';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Feedback from '../../Databases/Feedback';
import SwitchSelector from 'react-native-switch-selector';
import Dimensions from '../../Utils/Dimensions';
import { useState } from 'react';


 const FeedbackForm = (props) => {
  // TODO change duration based on slider position

  const [state, setState] = useState(
    {
        course: props.course,
        user: props.user,
        textInput: [],
        inputData: [],
        date: moment.utc(database().getServerTime())
        .add(360, 'minutes')
        .format('DD/MM/YYYY'),
        time: moment.utc(database().getServerTime())
          .add(360, 'minutes')
        .format('HH:mm:ss'),
        error: null,
        duration: 1,
         kind: null,
    }
  )

  addFeedback = async () => {
    if (state.kind === null) {
        setState(prevState => ({
            ...prevState,
            error: 'Please choose feedback type.'
        }))
     
    } else {
      const feedback = new Feedback();
      const curr = moment.utc(database().getServerTime());
      let startTime = curr.format('DD/MM/YYYY HH:mm:ss');

      let endTime = curr
        .add(state.duration, 'minutes')
        .format('DD/MM/YYYY HH:mm:ss');

      console.log(state.kind);
      await feedback.getFeedback(state.course.passCode).then(values => {
        if (values === null) {
          feedback
            .createFeedback(
              state.course.passCode,
              startTime,
              endTime,
              state.kind,
              state.user.email,
            )
            .then(r => {
              console.log('create');
              console.log(state.kind);
            });
        } else {
          const url = Object.keys(values)[0];
          const feedbackCount = Object.values(values)[0].feedbackCount;
          feedback
            .setFeedback(
              state.course.passCode,
              startTime,
              endTime,
              state.kind,
              state.user.email,
              url,
              false,
              feedbackCount + 1,
            )
            .then(r => {
              console.log('update');
              console.log(state.kind);
            });
        }
        setState(prevState => ({
            ...prevState,
            textInput: [],
          inputData: [],
          date: null,
          showDate: false,
          showTime: false,
          time: null,
          error: null,
          kind: null,
        }))
        
      });
    }
  };
let kindElement;
if (state.kind == 0) {
    kind_text = (
      <Text> Students will be given options: green, yellow and red </Text>
    );
  } else if (state.kind == 1) {
    kindElement = (
      <Text> Students will be given options: 1, 2, 3, 4, 5 </Text>
    );
  } else if (state.kind == 2) {
    kindElement = (
      <View>
        <ListItem containerStyle={styles.listContainer}>
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              What are the three most important things that you learnt?
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listContainer}>
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              What are the things that remain doubtful?
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <Text style={styles.minPaperHelperText}>
          {' '}
          Students will provide input in text format{' '}
        </Text>
      </View>
    );
  }

  
   
   
    

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <Text style={styles.heading}>
            {' '}
            Feedback {props.feedbackCount + 1}
          </Text>

          <View style={styles.selector}>
            <SwitchSelector
              onPress={value => {
                console.log(value);
                setState(prevValue => (
                    {
                        ...prevValue,
                        kind:value
                    }
                ))
               
              }}
              textColor={'black'}
              selectedColor={'black'}
              borderColor={'#383030'}
              options={[
                {label: 'Color Scale', value: '0', activeColor: 'tomato'},
                {label: 'Likert Scale', value: '1', activeColor: 'tomato'},
                {label: 'Minute Paper', value: '2', activeColor: 'tomato'},
              ]}
            />
          </View>
          <View style={styles.buttonContainer}>
            {state.error ? (
              <Text style={styles.errorMessage}>{state.error}</Text>
            ) : (
              <Text />
            )}

            <View style={styles.container}>
              <View style={styles.slider}>
                <Text style={styles.sliderText}>
                  {' '}
                  Timer: {state.duration} min
                </Text>

                <Slider
                  value={state.duration}
                  minimumValue={1}
                  step={1}
                  maximumValue={15}
                  // thumbTouchSize={{width: 100, height: 100}}
                  // thumbTintColor='#2697BF'
                  minimumTrackTintColor="tomato"
                  // maximumTrackTintColor="#000000"
                  trackStyle={{height: 10, backgroundColor: 'transparent'}}
                  thumbStyle={{
                    height: 35,
                    width: 35,
                    backgroundColor: 'transparent',
                  }}
                  thumbProps={{
                    Component: Animated.Image,
                    source: {
                      uri: 'https://i.ibb.co/Qn6nGyx/Clock.png',
                    },
                  }}
                  onValueChange={value => setState(prevState => ({
                    ...prevState,
                    duration:value
                  }))
                    }
                />
                <View style={styles.kindElement}>{kindElement}</View>
              </View>
            </View>
            <View>
              <Button
                buttonStyle={styles.mybutton}
                titleStyle={{color: 'white', fontWeight: 'normal'}}
                style={styles.buttonMessage}
                title="Start"
                onPress={
                    addFeedback}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    marginTop: 1,
    paddingTop: 2,
    marginBottom: 2,
    paddingBottom: 2,
  },
  kindElement: {
    marginTop: 20,
  },
  minPaperHelperText: {
    marginTop: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 10,
  },
  heading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 25,
    padding: 15,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
  dateTime: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  listContainer: {
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
  topic: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 20,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
  },
  rowContainer: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRowContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  textInput: {
    color: 'black',
    width: '80%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
  },
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  mydatebutton: {
    backgroundColor: '#333',
    borderColor: 'black',
    borderRadius: 20,
    width: Dimensions.window.width / 3,
    alignSelf: 'center',
  },
  sliderText: {
    flex: 1,
    display: 'flex',
    padding: 10,
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
  slider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: Dimensions.window.width - 60,
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

export default FeedbackForm;
