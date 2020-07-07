import React, {Component} from 'react';
import FeedbackResponses from '../Databases/FeedbackResponses';
import Feedback from '../Databases/Feedback';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../Utils/Dimensions';

export default class FeedbackResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responses : {},
            course : this.props.course
        };
    }

    componentDidMount() {
        this.getResponseData().then(r=>{console.log(this.state.responses)})
    }

    getResponseData = async ()=>{
        const feedbackResponses = new FeedbackResponses()
        const feedback = new Feedback()

        await feedback.getFeedbackDetails(this.state.course.passCode)
            .then(async r =>{
                await feedbackResponses.getAllResponse(this.state.course.passCode, r["startTime"], r["endTime"], r["topics"] )
                    .then( async values  =>{
                        await this.setState({
                            responses : values
                        })
                    })
        })
    }

    render(){
        return(

            <View style={styles.container}>
                <Text style={styles.heading}> Student Responses</Text>
                <View style={styles.grid}>
                    {this.props.topics.map((value, i) => (
                        <View key={i}>
                            <ListItem
                                 title={(i+1)+". " +value}
                                titleStyle={styles.title}
                                containerStyle={styles.listContainer}
                                bottomDivider
                            />
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
    heading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        fontSize : 22,
        fontWeight: "bold",
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding : 10
    },
    listContainer: {
        width : Dimensions.window.width-10,
        height : Dimensions.window.height/(11),
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2,
    },
})

