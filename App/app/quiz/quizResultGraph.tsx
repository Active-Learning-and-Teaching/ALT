import React, { useState, useEffect } from 'react';
import { PieChart } from "react-native-chart-kit";
import { ScrollView, StyleSheet, View } from 'react-native';
import Dimensions from '../utils/Dimentions';
import QuizResponses from '../database/quizresponse';
import Quiz from '../database/quiz';
import { Text } from 'react-native-elements';

interface QuizResultGraphProps {
    passCode: string;
    quizType: 'mcq' | 'alphaNumerical' | 'multicorrect' | 'numeric';
    date: string;
    correctAnswer: string;
    course?: {
        defaultEmailOption: boolean;
    };
    emailStatus?: boolean;
    quizresultData: (values: any, quizNumber: string) => void;
    QuizMailer?: () => void;
}

interface State {
    values: Record<string, number>;
    top5answer: Array<[string, number]>;
    quizNumber: string;
}

const QuizResultGraph: React.FC<QuizResultGraphProps> = (props) => {
    const [state, setState] = useState<State>({
        values: { 'A': 0, 'B': 0, 'C': 0, 'D': 0 },
        top5answer: [],
        quizNumber: "",
    });

    useEffect(() => {
        getGraphData();
    }, []);

    const getGraphData = async () => {
        const kbcResponse = new QuizResponses();
        const Kbc = new Quiz();

        await Kbc.getTiming(props.passCode).then(async (r: any) => {
            if (props.quizType === 'mcq') {
                await kbcResponse.getAllMcqResponse(props.passCode, r["startTime"], r["endTime"])
                    .then((values: { A: number; B: number; C: number; D: number; } | null) => {
                        setState((prevState) => ({
                            ...prevState,
                            values: values as Record<string, number>,
                            quizNumber: r["questionCount"],
                        }));
                        props.quizresultData(values, r["questionCount"]);
                    });

                if (props.course?.defaultEmailOption && props.emailStatus && props.QuizMailer) {
                    props.QuizMailer();
                }
            } else if (['alphaNumerical', 'multicorrect', 'numeric'].includes(props.quizType)) {
                await kbcResponse.getAllAlphaNumericalResponse(props.passCode, r["startTime"], r["endTime"])
                    .then(async (values: { [key: string]: number } | null) => {
                        const items = Object.entries(values as { [key: string]: number })
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5);

                        setState((prevState) => ({
                            ...prevState,
                            top5answer: items,
                            quizNumber: r["questionCount"],
                        }));

                        props.quizresultData(items, r["questionCount"]);
                    });

                if (props.course?.defaultEmailOption && props.emailStatus && props.QuizMailer) {
                    props.QuizMailer();
                }
            }
        });
    };

    const data = [
        {
            name: "A",
            responses: state.values['A'],
            color: "rgb(102, 255, 102)",
            legendFontColor: "#000",
            legendFontSize: 15
        },
        {
            name: "B",
            responses: state.values['B'],
            color: "rgb(102, 102, 255)",
            legendFontColor: "#000",
            legendFontSize: 15
        },
        {
            name: "C",
            responses: state.values['C'],
            color: "rgb(255, 255, 102)",
            legendFontColor: "#000",
            legendFontSize: 15
        },
        {
            name: "D",
            responses: state.values['D'],
            color: "rgb(252, 102, 102)",
            legendFontColor: "#000",
            legendFontSize: 15
        },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    return (
        <ScrollView>
            <Text style={styles.body}>
                Results: Quiz {state.quizNumber} ({props.date.split(" ")[0]})
            </Text>
            <View>
                {props.quizType === "mcq" ? (
                    <View style={styles.container}>
                        <PieChart
                            data={data}
                            width={Dimensions.window.width}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="responses"
                            backgroundColor="transparent"
                            paddingLeft="25"
                            absolute
                        />
                    </View>
                ) : ['alphaNumerical', 'multicorrect', 'numeric'].includes(props.quizType) ? (
                    <View style={styles.numContainer}>
                        <Text style={styles.body1}>Top 5 Answers</Text>
                        {state.top5answer.map((value, i) => (
                            <View key={i}>
                                <Text style={styles.body2}>
                                    <Text style={{ fontWeight: "bold" }}>{value[0]}</Text>
                                    {" : " + value[1]}
                                    {value[1] === 1 ? " Student" : " Students"}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text />
                )}

                {props.correctAnswer !== "*" ? (
                    <Text style={styles.ca}> Correct Answer: {props.correctAnswer.trim().toUpperCase()}</Text>
                ) : (
                    <View />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    body: {
        marginTop: 100,
        color: 'black',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight: "bold"
    },
    body1: {
        color: 'black',
        alignSelf: "center",
        fontSize: 20,
        paddingBottom: 30,
        fontWeight: "bold"
    },
    body2: {
        color: '#333',
        alignSelf: "center",
        fontSize: 18,
        paddingBottom: 20,
    },
    ca: {
        marginTop: 18,
        color: '#333',
        alignSelf: "center",
        fontSize: 18,
        paddingBottom: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        paddingRight: 10
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20
    },
    numContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20
    },
});

export default QuizResultGraph;
