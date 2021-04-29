import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {FC, useState, useEffect, useRef} from 'react';

import tailwind from 'tailwind-rn';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

const NotifiactionCentre: FC = () => {
  const [
    message,
    setMessage,
  ] = useState<null | FirebaseMessagingTypes.RemoteMessage>(null);

  const transition = useRef<Animated.Value>(new Animated.Value(300)).current;
  const exitAnim = useRef(
    Animated.timing(transition, {
      duration: 500,
      easing: Easing.in(Easing.exp),
      toValue: 300,
      useNativeDriver: true,
    }),
  ).current;
  const swipe = useRef(new Animated.Value(0)).current;

  const resetSwipe = useRef(
    Animated.timing(swipe, {
      duration: 200,
      toValue: 0,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
  ).current;
  const swipeOutLeft = useRef(
    Animated.timing(swipe, {
      duration: 50,
      toValue: Dimensions.get('screen').width * -1,
      useNativeDriver: true,
    }),
  ).current;
  const swipeOutRight = useRef(
    Animated.timing(swipe, {
      duration: 50,
      toValue: Dimensions.get('screen').width,
      useNativeDriver: true,
    }),
  ).current;
  const opacity = swipe.interpolate({
    inputRange: [
      Dimensions.get('screen').width * -1,
      0,
      Dimensions.get('screen').width,
    ],
    outputRange: [0, 1, 0],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: swipe}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.vx > 0.5) {
          swipeOutRight.start(() => {
            setMessage(null);
          });
        } else if (gs.vx < 0.5) {
          swipeOutLeft.start(() => {
            setMessage(null);
          });
        } else {
          resetSwipe.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.log(remoteMessage);
      if (remoteMessage.notification) {
        transition.setValue(300);
        const enterAnim = Animated.spring(transition, {
          toValue: 0,
          useNativeDriver: true,
        });
        swipe.setValue(0);
        setMessage(remoteMessage);
        enterAnim.start();
        const timeoutHandler = setTimeout(() => {
          exitAnim.start(() => {
            setMessage(null);
          });
        }, 7500);

        return () => {
          setMessage(null);
          clearTimeout(timeoutHandler);
        };
      }
    });
    return () => {
      unsubscribe();
    };
  }, [transition, exitAnim]);

  if (!message || !message.notification) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[
          tailwind('absolute top-10 z-10 inset-x-0 px-2 mb-2'),
          {transform: [{translateY: transition}, {translateX: swipe}], opacity},
        ]}>
        <TouchableOpacity
          {...panResponder.panHandlers}
          style={tailwind('bg-gray-800')}
          onPress={() => {
            exitAnim.start();
          }}>
          <View style={tailwind('py-3 px-4')}>
            <Text style={tailwind('text-white mb-1')} numberOfLines={1}>
              {message.notification.title}
            </Text>
            <Text style={tailwind('text-white text-sm')} numberOfLines={2}>
              {message.notification.body}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default NotifiactionCentre;
