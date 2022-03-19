import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from 'react-native-elements';
import Feedback from '../../Databases/Feedback';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import Dimensions from '../../Utils/Dimensions';

export default class FeedbackResultsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      responses: {},
      feedbackNumber: '',
      kind: null,
      avg_points: null,
    };
  }

  AvgPoints() {
    avg_points = this.state.avg_points;
    // console.log("Averaging for Likert Scale")
    sum = 0;
    n = 0;
    for (let i = 1; i < 6; i++) {
      sum += this.state.responses[i] * i;
      n += this.state.responses[i];
    }

    avg_points = sum / n;
    this.setState({
      avg_points: avg_points,
    });
  }

  componentDidMount() {
    this.getResponseData().then(r => {
      console.log(`All Feedback Responses`);
      console.log(this.state.responses);
    });
  }

  showMinutePaperSummary = (index) => {
    return this.state.responses[index].map((item,i) => {
      return( 
        <Text style = {styles.answers} key={i}>
          {item}
        </Text>
      );
    })
  }

  handleMinutePaperSummary = (r) => {
    const values = r.summary
    this.setState({
      responses: values,
      feedbackNumber: r.feedbackCount,
      kind: r.kind,
    });
    if(this.state.kind === ""){
      this.props.cancelFB()
    }
    else{
      this.props.feedbackresultData(
        values,
        this.state.feedbackNumber,
      );
      if (
        this.state.course.defaultEmailOption &&
        this.props.emailStatus &&
        r.summary
      ){
        this.props.FeedbackMailer().then(console.log("Sending Email"));
      }
    }
  }

  getResponseData = async () => {
    const feedbackResponses = new FeedbackResponses();
    const feedback = new Feedback();
    await feedback
      .getFeedbackDetails(this.state.course.passCode)
      .then(async r => {
        console.log(r);
        if (r.kind == '0' || r.kind == '1') {
          await feedbackResponses
            .getAllResponse(
              this.state.course.passCode,
              r.startTime,
              r.endTime,
              r.kind,
            )
            .then(async values => {
              // console.log("Logging resp values");
              // console.log(values);
              await this.setState({
                responses: values,
                feedbackNumber: r.feedbackCount,
                kind: r.kind,
              });

              if(this.state.kind === ""){
                this.props.cancelFB()
              }
              else{
                await this.props.feedbackresultData(
                  values,
                  this.state.feedbackNumber,
                );
                this.AvgPoints();
                if (
                  this.state.course.defaultEmailOption &&
                  this.props.emailStatus
                ){
                  await this.props.FeedbackMailer().then();
                }
              }});
        } else if(r.kind=="2") {
          // this.props.summarizeResponses().then(() => {
            if (r.summary){
              this.handleMinutePaperSummary(r);
              console.log("Showing Processed Summary");
            }
            else{
              console.log("Processing Summary");
              this.props.summarizeResponses().then(() => {
                console.log("Handle MP Summary");
                this.handleMinutePaperSummary(r);
              });
            }
          // })
        }   
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#08130D',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
    };
    if (this.state.kind === '0') {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>
            Feedback {this.state.feedbackNumber}
          </Text>
          <Text style={[styles.heading, {fontSize: 18, paddingTop: 5}]}>
            ({this.props.date.split(' ')[0]})
          </Text>
          <View style={styles.grid}>
            <View key={this.state.kind}>
              {this.state.responses ? (
                <PieChart
                  data={[
                    {
                      name: ': Green',
                      responses: this.state.responses[0],
                      color: 'green',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': Yellow',
                      responses: this.state.responses[1],
                      color: 'yellow',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': Red',
                      responses: this.state.responses[2],
                      color: 'red',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                  ]}
                  width={Dimensions.window.width - 10}
                  height={150}
                  chartConfig={chartConfig}
                  accessor="responses"
                  backgroundColor="white"
                  borderRadius={20}
                  paddingLeft="12"
                  absolute
                />
              ) : (
                <Text />
              )}
            </View>
          </View>
        </View>
      );
    } else if (this.state.kind === '1') {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>
            Feedback {this.state.feedbackNumber}
          </Text>
          <Text style={[styles.heading, {fontSize: 18, paddingTop: 5}]}>
            ({this.props.date.split(' ')[0]})
          </Text>
          <View style={styles.grid}>
            <View key="1">
              {this.state.responses ? (
                <PieChart
                  data={[
                    {
                      name: ': o',
                      responses: this.state.responses[1],
                      color: '#F3460A',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': oo',
                      responses: this.state.responses[2],
                      color: 'orange',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': ooo',
                      responses: this.state.responses[3],
                      color: 'pink',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': oooo',
                      responses: this.state.responses[4],
                      color: 'skyblue',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': ooooo',
                      responses: this.state.responses[5],
                      color: '#60CA24',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                  ]}
                  width={Dimensions.window.width - 10}
                  height={150}
                  chartConfig={chartConfig}
                  accessor="responses"
                  backgroundColor="white"
                  borderRadius={20}
                  paddingLeft="12"
                  absolute
                />
              ) : (
                <Text />
              )}
              <Text style={[styles.miniheading]}>
                {' '}
                Average Score : {this.state.avg_points}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    else if ( this.state.kind === "2" && this.state.responses){
      return(
        <View style = {styles.container}>
          <Text style = {styles.heading}> 
            Summary Of Responses
          </Text>
          {this.state.responses ? (
            <View style = {styles.container}>
              <Text style={[styles.questions, styles.shadow]}>
                What are the three most important things that you learnt?
              </Text>
              {this.showMinutePaperSummary(0)}
              {/* <Text style = {styles.answers}>Present Value of Future Payments</Text>
              <Text style = {styles.answers}>Forex Reserves</Text>
              <Text style = {styles.answers}>Straight Line Depreciation</Text> */}
              <Text style={[styles.questions, styles.shadow]}>
                What are the things that remain doubtful?
              </Text>
              {/* <Text style = {styles.answers}>Estimating price using Dividend discount model</Text>
              <Text style = {styles.answers}>Imports and Exports dependence on Forex Rates</Text>
              <Text style = {styles.answers}>Risk Adjusted Returns</Text> */}
              {this.showMinutePaperSummary(1)}
            </View>
            ) : (
                <Text />
            )
          }
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Fetching Results ...</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 6,
    paddingBottom: 6,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    marginTop: 1,
    paddingTop: 1,
    marginBottom: 2,
    paddingBottom: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 10,
  },
  heading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 25,
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
  miniheading: {
    padding: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  listContainer: {
    width: Dimensions.window.width - 10,
    height: Dimensions.window.height / 11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 24,
    borderRadius: 15,
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 2,
    paddingBottom: 2,
  },
  questions: {
    padding: 10,
    margin: 10,
    backgroundColor : "white",
    borderRadius : 10,
    fontWeight : "bold",
    width: 350,
  },
  answers: {
    padding: 10,
    margin: 2,
    backgroundColor : "#d4d1cf",
    borderRadius : 10,
    width: 350,
  },
});
