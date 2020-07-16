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

                    icon={ this.props.icona == 'check'
                        ? {name: this.props.icona, color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icona == 'check'
                        ? ''
                        : 'A'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
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
                    icon={ this.props.iconb == 'check'
                        ? {name: this.props.iconb, color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.iconb == 'check'
                        ? ''
                        : 'B'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
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
                    icon={ this.props.iconc == 'check'
                        ? {name: this.props.iconc, color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.iconc == 'check'
                        ? ''
                        : 'C'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
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
                    icon={ this.props.icond == 'check'
                        ? {name: this.props.icond, color: 'white', type: 'font-awesome'}
                        : {}
                    }
                    title={this.props.icond == 'check'
                        ? ''
                        : 'D'
                    }
                    titleStyle={{fontSize:24, fontWeight:'bold'}}
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
