import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FeedbackHomePage from '../feedback/feedbackHomePage';
import { useRoute, RouteProp } from '@react-navigation/native';

// Define the route params type
type FeedbackStackParamList = {
  Feedback: {
    type: 'faculty' | 'student';
    user: any; // Replace `any` with a specific type if available
    course: {
      courseName: string;
      passCode: string;
    };
  };
};

// Extract route params type for FeedbackStack
type FeedbackStackRouteProp = RouteProp<FeedbackStackParamList, 'Feedback'>;

const Stack = createStackNavigator<FeedbackStackParamList>();

const FeedbackStack: React.FC = () => {
  const routes = useRoute<FeedbackStackRouteProp>();
  const { type, user, course } = routes.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feedback"
        component={FeedbackHomePage}
        options={{
          headerShown: true,
          headerTitle: course.courseName,
          headerBackTitle: '',
        }}
        initialParams={{
          type: type,
          user: user,
          course: course,
        }}
      />
    </Stack.Navigator>
  );
};

export default FeedbackStack;
