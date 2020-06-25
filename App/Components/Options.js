import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

export default class Options extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <View style={styles.container}>

                <Avatar
                    size="large"
                    icon={{name: this.props.icona, color: 'orange', type: 'material-community'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("A",'check','alpha-b','alpha-c','alpha-d')
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={{name: this.props.iconb, color: 'orange', type: 'material-community'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("B",'alpha-a','check','alpha-c','alpha-d')
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={{name: this.props.iconc, color: 'orange', type: 'material-community'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("C",'alpha-a','alpha-b','check','alpha-d')
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={{name: this.props.icond, color: 'orange', type: 'material-community'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("D",'alpha-a','alpha-b','alpha-c','check')
                    }}
                    rounded
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
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom:10,
        paddingLeft : 30,
        paddingRight : 30
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
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },

})
