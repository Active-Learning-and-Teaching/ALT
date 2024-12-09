import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Text } from 'react-native-elements';
import Dimensions from '../utils/Dimentions';
import { Switch } from 'react-native-gesture-handler';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface StudentFeedbackCardProps {
  value: string;
  kind: number | any;
  index: string;
  studentResponses: (responses: any) => void;
}

interface State {
  textResponse1: string[];
  textResponse2: string[];
}

const StudentFeedbackCard: React.FC<StudentFeedbackCardProps> = (props) => {
  const [state, setState] = useState<State>({
    textResponse1: ['', '', ''],
    textResponse2: ['', '', ''],
  });

  const renderScale = () => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      items.push(
        <View key={`scale-${i}`}>
          <Text style={styles.active}>{i}</Text>
          <Text style={styles.line}>|</Text>
          <Text style={styles.space} />
        </View>
      );
    }
    return items;
  };

  const createTextInputsQuestion1 = () => {
    return state.textResponse1.map((_, i) => (
      <View style={styles.grid} key={`question1-${i}`}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={2}
          onChangeText={(value) => {
            const dupTextResponse1 = [...state.textResponse1];
            dupTextResponse1[i] = value;
            setState((prevState) => ({
              ...prevState,
              textResponse1: dupTextResponse1,
            }));

            props.studentResponses([dupTextResponse1, state.textResponse2]);
          }}
          placeholder={`Response ${i + 1}`}
          placeholderTextColor="grey"
          value={state.textResponse1[i]}
        />
      </View>
    ));
  };

  const createTextInputsQuestion2 = () => {
    return state.textResponse2.map((_, i) => (
      <View style={styles.grid} key={`question2-${i}`}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={2}
          onChangeText={(value) => {
            const dupTextResponse2 = [...state.textResponse2];
            dupTextResponse2[i] = value;
            setState((prevState) => ({
              ...prevState,
              textResponse2: dupTextResponse2,
            }));

            props.studentResponses([state.textResponse1, dupTextResponse2]);
          }}
          placeholder={`Response ${i + 1}`}
          placeholderTextColor="grey"
          value={state.textResponse2[i]}
        />
      </View>
    ));
  };

  if (props.kind === 0) {
    return (
      <View style={styles.grid}>
        <Switch
          onValueChange={(value) => {
            props.studentResponses(value);
          }}
        />
      </View>
    );
  } else if (props.kind === 1) {
    return (
      <View style={styles.grid}>
        <View style={styles.row}>
          <Text>Low </Text>
          <Text>High</Text>
        </View>
        <View style={styles.column}>{renderScale()}</View>
        <MultiSlider
          values={[1]}
          trackStyle={{ backgroundColor: '#333' }}
          selectedStyle={{ backgroundColor: 'tomato' }}
          sliderLength={Dimensions.window.width / 1.35}
          onValuesChange={(value: any) => {
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
  } else if (props.kind === 2) {
    return (
      <View style={styles.grid}>
        <Text style={[styles.questions, styles.shadow]}>
          What are the three most important things that you learnt?
        </Text>
        {createTextInputsQuestion1()}
        <Text style={[styles.questions, styles.shadow]}>
          What are the things that remain doubtful?
        </Text>
        {createTextInputsQuestion2()}
      </View>
    );
  } else {
    return <Text>No feedback</Text>;
  }
};

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
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
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
  questions: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    fontWeight: 'bold',
    width: 350,
  },
  textInput: {
    color: 'black',
    width: 325,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default StudentFeedbackCard;
