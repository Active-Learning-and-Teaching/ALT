import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-elements';

export default class StudentOrFaculty extends Component {
    constructor() {
        super();
        this.state = {
            icon: 'graduation-cap'
        };
    }

    render(){
        return(
            <View style = {styles.container}>

                <Avatar
                    size="xlarge"
                    rounded
                    icon={{name: this.state.icon, color: 'orange', type: 'font-awesome'}}
                    overlayContainerStyle={{backgroundColor: 'white'}}
                    onPress={() => this.setState({
                        icon: 'check'
                    })}
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },

    avatarStyle : {
        flex: 2,
        borderTopLeftRadius: 1
    },

    avatarContainer : {
        marginLeft: 20,
        marginTop: 115,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        //
        // elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },


});
