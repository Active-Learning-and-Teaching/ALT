import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

export default class Numeric extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            error_rate: 0,
        }
    }
    selectedValue(value){
        let setVal = this.state.selected
        let error = this.state.error_rate
        this.setState({
            selected : setVal,
            error_rate : error,
        })
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
                        overlayContainerStyle={this.state.selected[value] === 1
                            ? {backgroundColor:'#118040'}
                            : {backgroundColor:'#333'}}
                        onPress={() => {this.selectedValue(value,1)}}
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
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.00,
        elevation: 24,
    },

})
