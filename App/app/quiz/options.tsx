import React, { useState } from 'react';
import { Avatar } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

// Define the props interface
interface OptionsProps {
  icon: string; // The currently selected icon value
  optionValue: (value: string) => void; // Function to handle option selection
}

interface OptionsState {
  values: string[]; // Array of option values
}

const Options: React.FC<OptionsProps> = (props) => {
  // Initialize state
  const [state] = useState<OptionsState>({
    values: ['A', 'B', 'C', 'D'],
  });

  return (
    <View style={styles.container}>
      {state.values.map((value, i) => (
        <Avatar
          key={i}
          size="large"
          icon={
            props.icon === value
              ? { name: 'check', color: 'white', type: 'font-awesome' }
              : {}
          }
          title={props.icon === value ? '' : value}
          titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
          overlayContainerStyle={
            props.icon === value
              ? { backgroundColor: '#118040' }
              : { backgroundColor: '#333' }
          }
          onPress={() => {
            props.optionValue(value);
          }}
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

export default Options;
