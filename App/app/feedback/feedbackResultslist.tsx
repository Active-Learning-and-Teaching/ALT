import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from 'react-native-elements';
import Feedback from '../database/feedback';
import FeedbackResponses from '../database/feedbackresponses';
import Dimensions from '../utils/Dimentions';

interface FeedbackResultsListProps {
  course: {
    passCode: string;
    defaultEmailOption?: boolean;
  };
  date: string;
  emailStatus: boolean;
  feedbackresultData: (summary: any, feedbackNumber: string) => void;
  FeedbackMailer: () => Promise<void>;
  cancelFB: () => void;
  summarizeResponses: () => Promise<void>;
}

interface Responses {
  [key: number]: string[];
}

const FeedbackResultsList: React.FC<FeedbackResultsListProps> = ({
  course,
  date,
  emailStatus,
  feedbackresultData,
  FeedbackMailer,
  cancelFB,
  summarizeResponses,
}) => {
  const [responses, setResponses] = useState<Responses>({});
  const [feedbackNumber, setFeedbackNumber] = useState<string>('');
  const [kind, setKind] = useState<string | null>(null);
  const [avgPoints, setAvgPoints] = useState<number>(0);

  useEffect(() => {
    (async () => {
      await getResponseData().then(() => {
        console.log('All Feedback Responses');
        console.log(responses);
      });
    })();
  }, [course]);

  const AvgPoints = (fbResponses: { [key: number]: number }) => {
    let sum = 0;
    let n = 0;
    for (let i = 1; i < 6; i++) {
      sum += fbResponses[i] * i;
      n += fbResponses[i];
    }
    setAvgPoints(sum / n);
  };

  const showMinutePaperSummary = (index: number) => {
    return responses[index]?.map((item, i) => (
      <Text style={styles.answers} key={i}>
        {item}
      </Text>
    ));
  };

  const handleMinutePaperSummary = ({
    summary,
    feedbackCount,
    summaryKind,
  }: {
    summary: Responses;
    feedbackCount: string;
    summaryKind: string;
  }) => {
    setResponses(summary);
    setFeedbackNumber(feedbackCount);
    setKind(summaryKind);

    if (summaryKind === '') cancelFB();
    else {
      feedbackresultData(summary, feedbackNumber);

      if (course.defaultEmailOption && emailStatus && summary)
        FeedbackMailer().then(() => console.log('Sending Email'));
    }
  };

  const getResponseData = async () => {
    const feedbackResponses = new FeedbackResponses();
    const feedback = new Feedback();
    try {
      const res = await feedback.getFeedbackDetails(course.passCode);
      if (res === null) {
        console.log('No Feedback Data');
        return;
      }
      if (res.kind === '0' || res.kind === '1') {
        const values = await feedbackResponses.getAllResponse(
          course.passCode,
          res.startTime,
          res.endTime,
          res.kind
        );
        console.log('checking value in result', values);
        setResponses(values);
        setFeedbackNumber(res.feedbackCount);
        setKind(res.kind);

        if (res.kind === '') cancelFB();
        else {
          await feedbackresultData(values, feedbackNumber);
          AvgPoints(values);
          if (course.defaultEmailOption && emailStatus)
            await FeedbackMailer();
        }
      } else if (res.kind === '2') {
        // Handle kind 2
        console.log('kind 2 and wait', responses);
        setFeedbackNumber(res.feedbackCount);
        setKind(res.kind);
      }
    } catch (err) {
      console.log(err);
    }
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

  if (kind === '0') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Feedback {feedbackNumber}
        </Text>
        <Text style={[styles.heading, { fontSize: 18, paddingTop: 5 }]}>
          ({date.split(' ')[0]})
        </Text>
        <View style={styles.grid}>
          <View key={kind}>
            {responses ? (
              <PieChart
                data={[
                  {
                    name: ': Green',
                    responses: responses[0]?.length || 0,
                    color: 'green',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': Yellow',
                    responses: responses[1]?.length || 0,
                    color: 'yellow',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': Red',
                    responses: responses[2]?.length || 0,
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
  } else if (kind === '1') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Feedback {feedbackNumber}
        </Text>
        <Text style={[styles.heading, { fontSize: 18, paddingTop: 5 }]}>
          ({date.split(' ')[0]})
        </Text>
        <View style={styles.grid}>
          <View key="1">
            {responses ? (
              <PieChart
                data={[
                  {
                    name: ': 1',
                    responses: responses[1]?.length || 0,
                    color: '#F3460A',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': 2',
                    responses: responses[2]?.length || 0,
                    color: 'orange',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': 3',
                    responses: responses[3]?.length || 0,
                    color: 'pink',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': 4',
                    responses: responses[4]?.length || 0,
                    color: 'skyblue',
                    legendFontColor: 'black',
                    legendFontSize: 15,
                  },
                  {
                    name: ': 5',
                    responses: responses[5]?.length || 0,
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
                paddingLeft="12"
                absolute
              />
            ) : (
              <Text />
            )}
            <Text style={[styles.miniheading]}>
              {' '}
              Average Score : {avgPoints}
            </Text>
          </View>
        </View>
      </View>
    );
  } else if (kind === '2') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Email Sent</Text>
        {/* previous minute paper code snippet */}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Fetching Results ...</Text>
      </View>
    );
  }
};

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
    backgroundColor: 'white',
    borderRadius: 10,
    fontWeight: 'bold',
    width: 350,
  },
  answers: {
    padding: 10,
    margin: 2,
    backgroundColor: '#d4d1cf',
    borderRadius: 10,
    width: 350,
  },
});

export default FeedbackResultsList;
