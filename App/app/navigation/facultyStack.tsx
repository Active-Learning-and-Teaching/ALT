import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import FacultySettings from "../faculty-settings/FacultySettings";
import { useRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

interface RouteParams {
  type: string;
  user: any;
  course: any;
  setCourse: () => void;
}

const FacultySettingsStack: React.FC = () => {
    const routes = useRoute();
    const { type, user, course, setCourse } = routes.params as RouteParams;

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FacultySettings"
                component={FacultySettings}
                options={{
                    headerTitle: "Faculty Settings",
                    headerShown: true,
                    headerBackTitle: "",
                }}
                initialParams={{
                    type: type,
                    user: user,
                    course: course,
                    setCourse: setCourse,
                }}
            />
        </Stack.Navigator>
    );
};

export default FacultySettingsStack;
