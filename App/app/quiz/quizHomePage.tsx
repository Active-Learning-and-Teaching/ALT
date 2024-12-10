import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import moment from 'moment';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import QuizFacultyPage from './quizFacultyPage';
import QuizStudentPage from './quizStudentPage';
import { RouteProp } from '@react-navigation/native';

// Define interfaces for props and state
type QuizStackParamList = {
    Quiz: {
        type: string;
        course: Course;
        user: {
            url: string;
            name: string;
            email: string;
        };
    };
}

interface Course {
    passCode: string;
    TAs?: Record<string, boolean>;
    defaultEmailOption: boolean;
}

interface State {
    isTA: boolean | null;
    type: string;
    course: Course;
    user: {
        url: string;
        name: string;
        email: string
    };
    currentQuiz: boolean;
    currentDuration: number;
    quizType: "mcq" | "numeric" | "alphaNumerical" | "multicorrect";
    questionCount: string;
}

interface QuizHomePageProps {
    route: RouteProp<QuizStackParamList, 'Quiz'>;
}

const QuizHomePage: React.FC<QuizHomePageProps> = ({ route }) => {
    const { type, course, user } = route.params;
    const [state, setState] = useState<State>({
        isTA: null,
        type: type,
        course: course,
        user: user,
        currentQuiz: false,
        currentDuration: 0,
        quizType: "mcq",
        questionCount: '0',
    });

    const setQuizState = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            currentQuiz: false,
        }));
    }, []);

    const ifCurrentQuiz = () => {
        firestore()
            .collection('KBC')
            .where('passCode', '==', state.course.passCode)
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    const values = snapshot.docs[0].data();
                    const curr = moment.utc(database().getServerTime());
                    const startTime = moment.utc(values['startTime'], "DD/MM/YYYY HH:mm:ss");
                    const endTime = moment.utc(values['endTime'], "DD/MM/YYYY HH:mm:ss");
                    const duration = Math.abs(curr.diff(endTime, "seconds"));

                    if (curr >= startTime && curr <= endTime) {
                        setState((prevState) => ({
                            ...prevState,
                            currentQuiz: true,
                            currentDuration: duration,
                            quizType: values['quizType'],
                            questionCount: values['questionCount'],
                        }));
                    } else {
                        setState((prevState) => ({
                            ...prevState,
                            currentQuiz: false,
                            currentDuration: 0,
                            quizType: values['quizType'],
                            questionCount: values['questionCount'],
                        }));
                    }
                }
            });
    };

    const setIsTA = async () => {
        const allTAs = state.course.TAs ? Object.keys(state.course.TAs) : [];
        let isTA = false;
        allTAs.forEach((element) => {
            isTA = isTA || element.includes(state.user.url);
        });
        setState((prevState) => ({
            ...prevState,
            isTA: isTA,
        }));
    };

    useEffect(() => {
        ifCurrentQuiz();
        setIsTA();
    }, []);

    return (
        <SafeAreaView style={styles.safeContainer}>
            {state.type === "faculty" || state.isTA ? (
                <QuizFacultyPage
                    currentQuiz={state.currentQuiz}
                    currentDuration={state.currentDuration}
                    user={state.user}
                    course={state.course}
                    isTA={state.isTA}
                    setQuizState={setQuizState}
                    quizType={state.quizType}
                    questionNumber={state.questionCount}
                />
            ) : (
                <QuizStudentPage
                    currentQuiz={state.currentQuiz}
                    currentDuration={state.currentDuration}
                    user={state.user}
                    course={state.course}
                    setQuizState={setQuizState}
                    quizType={state.quizType}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
    },
});

export default QuizHomePage;