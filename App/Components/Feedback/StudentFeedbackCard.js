import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import SwitchSelector from 'react-native-switch-selector';

export default class StudentFeedbackCard extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={styles.grid}>
                <ListItem
                    containerStyle={styles.listContainer}
                    // bottomDivider
                >
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {(this.props.index+1)+". " +this.props.value}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <SwitchSelector
                    onPress={value => {
                        this.props.studentResponses(this.props.value, value)
                    }}
                    style={styles.shadow}
                    textStyle={{fontFamily:"arial"}}
                    textColor={'#383030'}
                    selectedColor={'white'}
                    borderColor={'#383030'}
                    // hasPadding
                    options={[
                        { label: "Not Much", value: "0", activeColor: '#F3460A'},
                        { label: "Somewhat", value: "1" ,activeColor: 'orange'},
                        { label: "Completely", value: "2", activeColor: '#60CA24'}
                    ]}
                />
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
        fontWeight: 'bold',
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 10.00,
        elevation: 24,
    },
    listContainer: {
        width : Dimensions.window.width-10,
        height : Dimensions.window.height/(11),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 16,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5.00,
        elevation: 24,

        borderColor: '#2697BF',
        borderRadius: 8,
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2,
    },
})
