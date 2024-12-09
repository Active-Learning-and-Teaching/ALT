import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import Announcement from '../announcement/announcement';
import CourseAdd from '../dashboard/courseAdd';

// Define the route params type
interface AnnouncementStackParams {
  type: string;
  user: { url: string };
  course: {
    TAs: Record<string, unknown>;
  };
}

// Define the type for the route
type AnnouncementStackRoute = RouteProp<{ params: AnnouncementStackParams }, 'params'>;

const Stack = createStackNavigator();

function AnnouncementStack() {
  const routes = useRoute<AnnouncementStackRoute>();
  const { type, user, course } = routes.params;
  const [isTA, setIsTA] = useState<boolean | null>(null);

  useEffect(() => {
    const setTA = async () => {
      const allTAs = Object.keys(course.TAs);
      allTAs.forEach((element) => setIsTA((prev) => prev || element.includes(user.url)));
      console.log(isTA);
    };
    setTA();
  }, [course.TAs, user.url, isTA]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Announcements"
        component={Announcement}
        options={{
          headerTitle: 'Announcement',
          headerShown: true,
          headerBackTitle: '',
          headerRight: () => (
            type === 'faculty' || isTA ?
            <CourseAdd
                course={course}
                type={'course'}
                student={undefined}
            /> : null
          ),
        }}
        initialParams={{
          type: type,
          user: user,
          course: course,
        }}
      />
    </Stack.Navigator>
  );
}

export default AnnouncementStack;
