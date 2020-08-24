import React, {Component} from 'react';
import { PieChart } from "react-native-chart-kit";
import {ScrollView, StyleSheet, View} from 'react-native';
import Dimensions from '../../Utils/Dimensions';
import QuizResponses from '../../Databases/QuizResponses';
import Quiz from '../../Databases/Quiz';
import {Text} from 'react-native-elements';

export default class QuizResultGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {'A':0, 'B':0, 'C':0, 'D':0},
            top5answer:[],
            quizNumber : "",
        };
    }


    componentDidMount() {
        this.getGraphData().then(r => console.log(this.state.values))
    }


    getGraphData = async ()=>{
        const kbcResponse = new QuizResponses()
        const Kbc = new Quiz()

        await Kbc.getTiming(this.props.passCode).then(r =>{
            if(this.props.quizType==='mcq'){
                kbcResponse.getAllMcqResponse(this.props.passCode, r["startTime"], r["endTime"] )
                    .then( values  =>{
                        this.setState({
                            values : values,
                            quizNumber : r["questionCount"]
                        })
                        console.log(values)
                        this.props.quizresultData(values,this.state.quizNumber)
                    })
            }
            else if(this.props.quizType==='numerical'){
                kbcResponse.getAllNumericalResponse(this.props.passCode, r["startTime"], r["endTime"] )
                    .then( values  =>{
                        //https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
                        const items = Object.keys(values).map(function (key) {
                            return [key, values[key]];
                        });
                        items.sort(function(first, second) {
                            return second[1] - first[1];
                        });
                        this.setState({
                            top5answer : items.slice(0, 5),
                            quizNumber : r["questionCount"]
                        })
                        console.log(this.state.top5answer)
                        console.log(values);
                        this.props.quizresultData(this.state.top5answer,this.state.quizNumber)
                    })
            }

        })
    }

    render() {
        const data = [
            {
                name: "A",
                responses: this.state.values['A'],
                color: "rgb(77, 137, 249)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "B",
                responses: this.state.values['B'],
                color: "rgb(0, 184, 138)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "C",
                responses: this.state.values['C'],
                color: "rgb(255, 159, 64)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "D",
                responses: this.state.values['D'],
                color: "rgb(255, 99, 132)",
                legendFontColor: "#7F7F7F",
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
                    Results - Quiz {this.state.quizNumber} ({this.props.date.split(" ")[0]})
                </Text>
                <View>
                {this.props.quizType==="mcq"?
                    <View style={styles.container}>
                        <PieChart
                            data={data}
                            width={Dimensions.window.width}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="responses"
                            backgroundColor="transparent"
                            paddingLeft="25"
                            absolute
                        />
                    </View>
                    :
                    this.props.quizType==="numerical"
                    ?
                    <View style={styles.numContainer}>
                        <Text style={styles.body1}>Top 5 Answers</Text>
                        {this.state.top5answer.map((value, i) => (
                            <View key={i}>
                                <Text style={styles.body2}>
                                    <Text style={{fontWeight:"bold"}}>{value[0]}</Text>
                                    { " : " +value[1]}
                                    {value[1]===1
                                        ? " Student"
                                        : " Students"
                                    }
                                </Text>
                            </View>
                        ))}
                    </View>
                    :
                    <Text/>
                }

                {this.props.correctAnswer!=="0"
                    ? <Text style={styles.ca}> Correct Answer  : {this.props.correctAnswer}</Text>
                    :<View/>
                }
                </View>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    body: {
        marginTop: 100,
        color: 'grey',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
    body1: {
        color: 'grey',
        alignSelf: "center",
        fontSize: 20,
        paddingBottom : 30,
        fontWeight : "bold"
    },
    body2: {
        color: 'grey',
        alignSelf: "center",
        fontSize: 18,
        paddingBottom : 20,
    },
    ca: {
        marginTop: 18,
        color: 'grey',
        alignSelf: "center",
        fontSize: 18,
        paddingBottom: 20,
        fontWeight : "bold"
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding:30,
        backgroundColor : 'white',
        borderRadius :20
    },
    numContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        padding:30,
        backgroundColor : 'white',
        borderRadius :20
    },
})
