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

                    icon={ this.props.icon == 'A'
                        ? {name: "check", color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icon == 'A'
                        ? ''
                        : 'A'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("A")
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={ this.props.icon == 'B'
                        ? {name: "check", color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icon == 'B'
                        ? ''
                        : 'B'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("B")
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={ this.props.icon == 'C'
                        ? {name: "check", color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icon == 'C'
                        ? ''
                        : 'C'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("C")
                    }}
                    rounded
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={styles.avatarContainer}
                />
                <Avatar
                    size="large"
                    icon={ this.props.icon == 'D'
                        ? {name: "check", color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icon == 'D'
                        ? ''
                        : 'D'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
                    overlayContainerStyle={{backgroundColor: '#2697BF'}}
                    onPress={() => { this.props.optionValue("D")
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
