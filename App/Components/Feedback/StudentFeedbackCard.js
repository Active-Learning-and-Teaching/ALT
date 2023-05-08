import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import SwitchSelector from 'react-native-switch-selector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class StudentFeedbackCard extends Component{
    constructor(props) {
        super(props);
    }

    renderScale=()=> {
        const items = [];
        for (let i=1; i <= 5; i++) {
            items.push(
                <View>
                <Text style={styles.active}>{i}</Text>
                <Text style={styles.line}>|</Text>
                <Text style={styles.space}> </Text>
                </View>
            );
        }
        return items;
    }

    render(){
        if(this.props.kind === "0")
        return(
            <View style={styles.grid}>
                <ListItem containerStyle={styles.listContainer} >
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {(this.props.index+1)+". " +this.props.value}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <SwitchSelector
                    onPress={value => {this.props.studentResponses(this.props.value, value)}}
                    textColor={'#383030'}
                    selectedColor={'white'}
                    borderColor={'#383030'}
                    options={[
                        { label: "Not Much", value: "0", activeColor: '#F3460A'},
                        { label: "Somewhat", value: "1" ,activeColor: 'orange'},
                        { label: "Completely", value: "2", activeColor: '#60CA24'}
                    ]}/>
                    
            </View>)
        else
        return(
            <View style={styles.grid}>
                <ListItem containerStyle={styles.listContainer}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {(this.props.index+1)+". " +this.props.value}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                
                <View style={[styles.column]}>
                {this.renderScale()}
                </View>
                <MultiSlider
                    values={[1]}
                    trackStyle={{backgroundColor:'#333'}}
                    selectedStyle={{backgroundColor:"tomato"}}
                    sliderLength={Dimensions.window.width/1.35}
                    onValuesChange={value => {this.props.studentResponses(this.props.value, value[0])}}
                    min={1}
                    max={5}
                    step={1}
                    allowOverlap={false}
                    snapped={true}
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
            height: 2,
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
    column:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center',
        width: Dimensions.window.width/2.8,

        bottom:-20,
    },
    active:{
        textAlign: 'center',
        fontSize:20,
        color:'#333',
    },
    line:{
        fontSize:10,
        textAlign: 'center',
        color:'#333',
    },
    space:{
        paddingLeft:Dimensions.window.width/6,
        paddingRight:0,
    },
    selector:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 5,
        marginTop: 5,
        textAlign: 'center',
    },
})
