import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from 'react-native-elements';
import Feedback from '../../Databases/Feedback';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import Dimensions from '../../Utils/Dimensions';

const FeedbackResultsList = (props) =>  {
 

  const [state, setState] = useState({
    course: props.course,
    responses: {},
    feedbackNumber: '',
    kind: null,
    avg_points: null,
  })

  const AvgPoints = () => {
    avg_points = state.avg_points;
    // console.log("Averaging for Likert Scale")
    sum = 0;
    n = 0;
    for (let i = 1; i < 6; i++) {
      sum += state.responses[i] * i;
      n += state.responses[i];
    }

    avg_points = sum / n;
    setState (prevState => ({
        ...prevState,
        avg_points: avg_points,    
    }))
  }

  useEffect(() => {
    getResponseData().then(r => {
        console.log(`All Feedback Responses`);
        console.log(state.responses);
      });
  }, [])

  showMinutePaperSummary = (index) => {
    return state.responses[index].map((item,i) => {
      return( 
        <Text style = {styles.answers} key={i}>
          {item}
        </Text>
      );
    })
  }

  handleMinutePaperSummary = (r) => {
    const values = r.summary
    setState(prevState => ({
        ...prevState,
        responses: values,
      feedbackNumber: r.feedbackCount,
      kind: r.kind,

    }))
    
    if(state.kind === ""){
      props.cancelFB()
    }
    else{
      props.feedbackresultData(
        values,
        state.feedbackNumber,
      );
      if (
        state.course.defaultEmailOption &&
        props.emailStatus &&
        r.summary
      ){
        props.FeedbackMailer().then(console.log("Sending Email"));
      }
    }
  }

  getResponseData = async () => {
    const feedbackResponses = new FeedbackResponses();
    const feedback = new Feedback();
    await feedback
      .getFeedbackDetails(state.course.passCode)
      .then(async r => {
        console.log(r);
        if (r.kind == '0' || r.kind == '1') {
          await feedbackResponses
            .getAllResponse(
              state.course.passCode,
              r.startTime,
              r.endTime,
              r.kind,
            )
            .then(async values => {
              // console.log("Logging resp values");
              // console.log(values);
              await setState(prevState => ({
                ...prevState,
                responses: values,
                feedbackNumber: r.feedbackCount,
                kind: r.kind,

              }))
              

              if(state.kind === ""){
                props.cancelFB()
              }
              else{
                await props.feedbackresultData(
                  values,
                  state.feedbackNumber,
                );
                AvgPoints();
                if (
                  state.course.defaultEmailOption &&
                  props.emailStatus
                ){
                  await props.FeedbackMailer().then();
                }
              }});
        } else if(r.kind=="2") {
          // props.summarizeResponses().then(() => {
            if (r.summary){
              handleMinutePaperSummary(r);
              console.log("Showing Processed Summary");
            }
            else{
              console.log("Processing Summary");
              props.summarizeResponses().then(() => {
                console.log("Handle MP Summary");
                handleMinutePaperSummary(r);
              });
            }
          // })
        }   
      })
      .catch(error => {
        console.error(error);
      });
  };
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

  
    
    if (state.kind === '0') {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>
            Feedback {state.feedbackNumber}
          </Text>
          <Text style={[styles.heading, {fontSize: 18, paddingTop: 5}]}>
            ({props.date.split(' ')[0]})
          </Text>
          <View style={styles.grid}>
            <View key={state.kind}>
              {state.responses ? (
                <PieChart
                  data={[
                    {
                      name: ': Green',
                      responses: state.responses[0],
                      color: 'green',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': Yellow',
                      responses: state.responses[1],
                      color: 'yellow',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': Red',
                      responses: state.responses[2],
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
    } else if (state.kind === '1') {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>
            Feedback {state.feedbackNumber}
          </Text>
          <Text style={[styles.heading, {fontSize: 18, paddingTop: 5}]}>
            ({props.date.split(' ')[0]})
          </Text>
          <View style={styles.grid}>
            <View key="1">
              {state.responses ? (
                <PieChart
                  data={[
                    {
                      name: ': o',
                      responses: state.responses[1],
                      color: '#F3460A',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': oo',
                      responses: state.responses[2],
                      color: 'orange',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': ooo',
                      responses: state.responses[3],
                      color: 'pink',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': oooo',
                      responses: state.responses[4],
                      color: 'skyblue',
                      legendFontColor: 'black',
                      legendFontSize: 15,
                    },
                    {
                      name: ': ooooo',
                      responses: state.responses[5],
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
                Average Score : {state.avg_points}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    else if ( state.kind === "2" && state.responses){
      return(
        <View style = {styles.container}>
          <Text style = {styles.heading}> 
            Summary Of Responses
          </Text>
          {state.responses ? (
            <View style = {styles.container}>
              <Text style={[styles.questions, styles.shadow]}>
                What are the three most important things that you learnt?
              </Text>
              {showMinutePaperSummary(0)}
              {/* <Text style = {styles.answers}>Present Value of Future Payments</Text>
              <Text style = {styles.answers}>Forex Reserves</Text>
              <Text style = {styles.answers}>Straight Line Depreciation</Text> */}
              <Text style={[styles.questions, styles.shadow]}>
                What are the things that remain doubtful?
              </Text>
              {/* <Text style = {styles.answers}>Estimating price using Dividend discount model</Text>
              <Text style = {styles.answers}>Imports and Exports dependence on Forex Rates</Text>
              <Text style = {styles.answers}>Risk Adjusted Returns</Text> */}
              {showMinutePaperSummary(1)}
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


export default  FeedbackResultsList;