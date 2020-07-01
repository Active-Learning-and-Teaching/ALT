import React, {Component} from 'react';
import { PieChart } from "react-native-chart-kit";
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import KBCResponses from '../Databases/KBCResponses';
import KBC from '../Databases/KBC';
import {Text} from 'react-native-elements';
const screenWidth = Dimensions.get("window").width;

export default class QuizResultGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {'A':0, 'B':0, 'C':0, 'D':0},
        };
    }


    componentDidMount() {
        this.getGraphData().then(r => console.log(this.state.values))
    }


    getGraphData = async ()=>{
        const kbcResponse = new KBCResponses()
        const Kbc = new KBC()

        await Kbc.getTiming(this.props.passCode).then(r =>{
            kbcResponse.getAllResponse(this.props.passCode, r["startTime"], r["endTime"] )
                .then( values  =>{
                    this.setState({
                        values : values
                    })
                    console.log(this.state.values)
            })
        })
    }

    render() {
        const data = [
            {
                name: "A",
                responses: this.state.values['A'],
                color: "rgba(131, 167, 234, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "B",
                responses: this.state.values['B'],
                color: "#FF5451",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "C",
                responses: this.state.values['C'],
                color: "#8B0000",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "D",
                responses: this.state.values['D'],
                color: "#14376E",
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
                <Text style={styles.body}> Quiz Results</Text>
                <PieChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="responses"
                    backgroundColor="transparent"
                    paddingLeft="25"
                    absolute
                />
                <Text style={styles.ca}> Correct Answer  : {this.props.correctAnswer}</Text>
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
    ca: {
        marginTop: 18,
        color: 'grey',
        alignSelf: "center",
        fontSize: 18,
        paddingBottom: 20,
        fontWeight : "bold"
    },
})
