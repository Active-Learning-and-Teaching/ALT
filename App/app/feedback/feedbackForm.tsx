import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Animated,
} from 'react-native';
import { Button, ListItem, Slider, Text } from 'react-native-elements';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Feedback from '../database/feedback';
import { Switch } from 'react-native-gesture-handler';
import Dimensions from '../utils/Dimentions';

interface FeedbackFormProps {
  course: { passCode: string };
  user: { email: string };
  feedbackCount: number;
  setKind: (kind: string) => void;
}

interface State {
  course: { passCode: string };
  user: { email: string };
  textInput: string[];
  inputData: string[];
  date: string;
  time: string;
  error: string | null;
  duration: number;
  kind: string | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = (props) => {
  const [state, setState] = useState<State>({
    course: props.course,
    user: props.user,
    textInput: [],
    inputData: [],
    date: moment.utc(database().getServerTime()).add(360, 'minutes').format('DD/MM/YYYY'),
    time: moment.utc(database().getServerTime()).add(360, 'minutes').format('HH:mm:ss'),
    error: null,
    duration: 1,
    kind: '0',
  });

  const addFeedback = async () => {
    if (state.kind === null) {
      setState((prevState) => ({
        ...prevState,
        error: 'Please choose feedback type.',
      }));
    } else {
      const feedback = new Feedback();
      const curr = moment.utc(database().getServerTime());
      const startTime = curr.format('DD/MM/YYYY HH:mm:ss');
      const endTime = curr.add(state.duration, 'minutes').format('DD/MM/YYYY HH:mm:ss');

      try {
        const values = await feedback.getFeedback(state.course.passCode);

        if (values === null) {
          await feedback.createFeedback(
            state.course.passCode,
            startTime,
            endTime,
            state.kind,
            state.user.email
          );
        } else {
          const url = values.id;
          const feedbackCount = values.feedbackCount;
          await feedback.setFeedback(
            state.course.passCode,
            startTime,
            endTime,
            state.kind,
            state.user.email,
            url,
            false,
            feedbackCount + 1
          );
        }

        setState((prevState) => ({
          ...prevState,
          textInput: [],
          inputData: [],
          date: '',
          time: '',
          error: null,
          kind: null,
        }));
      } catch (error) {
        console.error('Error adding feedback:', error);
      }
    }
  };

  let kindElement;
  if (state.kind === '0') {
    kindElement = <Text>Students will be given options: green, yellow, and red</Text>;
  } else if (state.kind === '1') {
    kindElement = <Text>Students will be given options: 1, 2, 3, 4, 5</Text>;
  } else if (state.kind === '2') {
    kindElement = (
      <View>
        <ListItem containerStyle={styles.container}>
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              What are the three most important things that you learnt?
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.container}>
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              What are the things that remain doubtful?
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Text style={styles.minPaperHelperText}>
          Students will provide input in text format
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <Text style={styles.heading}>Feedback {props.feedbackCount + 1}</Text>

        <View style={styles.selector}>
          <View style={styles.switchContainer}>
            <Text>Feedback Type:</Text>
            <View style={styles.switchWrapper}>
              <Text>Color Scale</Text>
              <Switch
                value={state.kind === '0'}
                onValueChange={() => setState({ ...state, kind: state.kind === '0' ? null : '0' })}
              />
              <Text>Likert Scale</Text>
              <Switch
                value={state.kind === '1'}
                onValueChange={() => setState({ ...state, kind: state.kind === '1' ? null : '1' })}
              />
              <Text>Minute Paper</Text>
              <Switch
                value={state.kind === '2'}
                onValueChange={() => setState({ ...state, kind: state.kind === '2' ? null : '2' })}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {state.error && <Text style={styles.errorMessage}>{state.error}</Text>}

          <View style={styles.container}>
            <View style={styles.slider}>
              <Text style={styles.sliderText}>Timer: {state.duration} min</Text>
              <Slider
                value={state.duration}
                minimumValue={1}
                step={1}
                maximumValue={15}
                minimumTrackTintColor="tomato"
                trackStyle={{ height: 10, backgroundColor: 'transparent' }}
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
                onValueChange={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    duration: value,
                  }))
                }
              />
              <View style={styles.kindElement}>{kindElement}</View>
            </View>
          </View>

          <Button
            buttonStyle={styles.mybutton}
            titleStyle={{ color: 'white', fontWeight: 'normal' }}
            title="Start"
            onPress={addFeedback}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  switchContainer: {
    paddingTop: 20,
  },
  switchWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
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
});

export default FeedbackForm;
