import React, { useState } from 'react';
import { Avatar } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

// Define the props interface
interface MultiCorrectOptionsProps {
  optionValue: (value: string) => void; // Function to pass the selected option value
}

interface MultiCorrectOptionsState {
  values: string[]; // Array of option values
  selected: Record<string, number>; // Selected options with values (0 or 1)
}

const MultiCorrectOptions: React.FC<MultiCorrectOptionsProps> = (props) => {
  // Initialize state
  const [state, setState] = useState<MultiCorrectOptionsState>({
    values: ['A', 'B', 'C', 'D'],
    selected: { A: 0, B: 0, C: 0, D: 0 },
  });

  // Handle option selection
  const selectedValue = (value: string): void => {
    const setVal = { ...state.selected };
    setVal[value] = state.selected[value] === 0 ? 1 : 0;

    setState((prevState) => ({
      ...prevState,
      selected: setVal,
    }));

    let answer = '';
    for (const key in setVal) {
      if (setVal[key] === 1) {
        answer += `${key},`;
      }
    }

    if (answer.length !== 0) {
      answer = answer.substring(0, answer.length - 1); // Remove trailing comma
    }

    props.optionValue(answer); // Pass selected options to parent component
  };

  return (
    <View style={styles.container}>
      {state.values.map((value, i) => (
        <Avatar
          key={i}
          size="large"
          icon={
            state.selected[value] === 1
              ? { name: 'check', color: 'white', type: 'font-awesome' }
              : {}
          }
          title={state.selected[value] === 1 ? '' : value}
          titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
          overlayContainerStyle={
            state.selected[value] === 1
              ? { backgroundColor: '#118040' }
              : { backgroundColor: '#333' }
          }
          onPress={() => selectedValue(value)}
          rounded
          activeOpacity={0.7}
          avatarStyle={styles.avatarStyle}
          containerStyle={styles.avatarContainer}
        />
      ))}
    </View>
  );
};

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

export default MultiCorrectOptions;
