import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

export default class MultiCorrectOptions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            values: ["A", "B", "C", "D"],
            selected: {"A": 0, "B": 0, "C": 0, "D": 0},
        }
    }
    selectedValue(value){
        let setVal = this.state.selected
        setVal[value] = this.state.selected[value]===0?1:0
        this.setState({
            selected : setVal
        })
        setVal = this.state.selected
        let answer = ""
        for (let x in setVal) {
           answer+= setVal[x] === 1? x+"," : ""
        }
        if(answer.length!=0)
            answer=answer.substring(0,answer.length-1)
        this.props.optionValue(answer)
    }
    render(){
        return(
            <View style={styles.container}>
                {this.state.values.map((value, i)=> (
                    <Avatar
                        key = {i}
                        size="large"
                        icon={ this.state.selected[value] === 1
                            ? {name: "check", color: 'white', type: 'font-awesome'}
                            : {}
                        }
                        title={this.state.selected[value] === 1 ? '' : value}
                        titleStyle={{fontSize:24, fontWeight:'bold'}}
                        overlayContainerStyle={{backgroundColor: '#2697BF'}}
                        onPress={() => {this.selectedValue(value)}}
                        rounded
                        activeOpacity={0.7}
                        avatarStyle={styles.avatarStyle}
                        containerStyle={styles.avatarContainer}
                    />
                ))}
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom:10,
        paddingLeft : 15,
        paddingRight : 15
    },
    avatarStyle : {
        flex: 2,
        borderTopLeftRadius: 1
    },
    avatarContainer : {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.00,
        elevation: 24,
    },

})
