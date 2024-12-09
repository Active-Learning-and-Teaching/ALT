import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface CountdownProps {
  initialSeconds: number;
  until: number;
  onFinish: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ initialSeconds, onFinish }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, [secondsLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 32,
    color: 'tomato',
    fontWeight: 'bold',
  },
});

export default Countdown;
