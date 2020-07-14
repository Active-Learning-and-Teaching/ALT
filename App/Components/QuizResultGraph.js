import React, {Component} from 'react';
import { PieChart } from "react-native-chart-kit";
import {ScrollView, StyleSheet, View} from 'react-native';
import Dimensions from '../Utils/Dimensions';
import KBCResponses from '../Databases/KBCResponses';
import KBC from '../Databases/KBC';
import {Text} from 'react-native-elements';

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
                    this.props.quizresultData(values)
            })
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
                <Text style={styles.body}> Quiz Results ({this.props.date.split(" ")[0]})</Text>
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
                {this.props.correctAnswer!=="0" ?<Text style={styles.ca}> Correct Answer  : {this.props.correctAnswer}</Text> :<View/>}
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
