import React, {Component} from 'react';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import Feedback from '../../Databases/Feedback';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import {PieChart} from 'react-native-chart-kit';

export default class FeedbackResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            responses : {},
            feedbackNumber : "",
            kind : null,
            avg_points : {},
        };
    }

    AvgPoints(){   
        avg_points = this.state.avg_points
        for (value in this.state.responses){
        sum = 0
        n = 0
        for(let i = 1; i < 6; i++){ 
            sum += this.state.responses[value][i]*i
            n += this.state.responses[value][i]
        }
        avg = sum/n
        avg_points[value]=avg
    }
        this.setState({
            avg_points : avg_points
        })
    }
    

    componentDidMount(){
        this.getResponseData().then(r=>console.log(this.state.responses))
    }

    getResponseData = async ()=>{
        const feedbackResponses = new FeedbackResponses()
        const feedback = new Feedback()
        await feedback.getFeedbackDetails(this.state.course.passCode)
            .then(async r =>{
                await feedbackResponses.getAllResponse(
                    this.state.course.passCode,
                    r["startTime"],
                    r["endTime"],
                    r["topics"],
                    r["kind"]
                ).then( async values  =>{
                    await this.setState({
                        responses : values,
                        feedbackNumber : r["feedbackCount"],
                        kind : r["kind"],
                    })
                    await this.props.feedbackresultData(values,this.state.feedbackNumber)
                    await this.AvgPoints()
                    if(this.state.course.defaultEmailOption && this.props.emailStatus){
                        await this.props.studentsResponseMailer()
                            .then(()=>"")
                    }
                })
        })
    }

    render(){
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
        if (this.state.kind === "0")
        return(

            <View style={styles.container}>
                <Text style={styles.heading}>
                    Feedback {this.state.feedbackNumber}
                </Text>
                <Text style={[styles.heading,{fontSize: 18,paddingTop : 5}]}>
                    ({this.props.date.split(" ")[0]})
                </Text>
                <View style={styles.grid}>
                    {this.props.topics.map((value, i) => (

                        <View key={i}>
                            <ListItem
                                containerStyle={styles.listContainer}
                            >
                                <ListItem.Content>
                                    <ListItem.Title style={styles.title}>
                                        {(i+1)+". " +value}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            {value in this.state.responses
                            ?
                                <PieChart
                                    data={
                                        [
                                            {
                                                name: ": Not Much",
                                                responses: this.state.responses[value][0],
                                                color: "#F3460A",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": Somewhat",
                                                responses: this.state.responses[value][1],
                                                color: 'orange',
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": Completely",
                                                responses: this.state.responses[value][2],
                                                color: "#60CA24",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                        ]
                                    }
                                    width={Dimensions.window.width-10}
                                    height={150}
                                    chartConfig={chartConfig}
                                    accessor="responses"
                                    backgroundColor="white"
                                    borderRadius = {20}
                                    paddingLeft="12"
                                    absolute
                                />
                                :
                                <Text/>
                            }

                        </View>
                    ))}
                </View>
            </View>
        )

        else
        return(

            <View style={styles.container}>
                <Text style={styles.heading}>
                    Feedback {this.state.feedbackNumber}
                </Text>
                <Text style={[styles.heading,{fontSize: 18,paddingTop : 5}]}>
                    ({this.props.date.split(" ")[0]})
                </Text>
                <View style={styles.grid}>
                    {this.props.topics.map((value, i) => (

                        <View key={i}>
                            <ListItem
                                containerStyle={styles.listContainer}
                            >
                                <ListItem.Content>
                                    <ListItem.Title style={styles.title}>
                                        {(i+1)+". " +value}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            {value in this.state.responses
                            ?
                                <PieChart
                                    data={
                                        [
                                            {
                                                name: ": o",
                                                responses: this.state.responses[value][1],
                                                color: "#F3460A",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": oo",
                                                responses: this.state.responses[value][2],
                                                color: 'orange',
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": ooo",
                                                responses: this.state.responses[value][3],
                                                color: "pink",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": oooo",
                                                responses: this.state.responses[value][4],
                                                color: "skyblue",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                            {
                                                name: ": ooooo",
                                                responses: this.state.responses[value][5],
                                                color: "#60CA24",
                                                legendFontColor: "black",
                                                legendFontSize: 15
                                            },
                                        ]
                                    }
                                    width={Dimensions.window.width-10}
                                    height={150}
                                    chartConfig={chartConfig}
                                    accessor="responses"
                                    backgroundColor="white"
                                    borderRadius = {20}
                                    paddingLeft="12"
                                    absolute
                                />
                                :
                                <Text/>
                                
                            }
                            <Text style={[styles.miniheading]}> Average Score : {this.state.avg_points[value]}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    grid: {
        marginTop: 6,
        marginBottom: 6,
        paddingTop : 6,
        paddingBottom : 6,
        alignItems: 'center',
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        color:'black',
        marginTop: 1,
        paddingTop : 1,
        marginBottom: 2,
        paddingBottom : 2,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.50,
        elevation: 10,
    },
    heading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        fontSize : 25,
        fontWeight: "bold",
        color: 'black',
        marginTop: 5,
        textAlign: 'center',
    },
    miniheading : {
        padding: 15,
        fontSize : 15,
        fontWeight: "bold",
        color: "#333",
        textAlign: 'center',
        backgroundColor : 'white',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding : 10,
    },
    listContainer: {
        width : Dimensions.window.width-10,
        height : Dimensions.window.height/(11),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.50,
        elevation: 24,
        borderRadius: 15,
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2,
    },
})

