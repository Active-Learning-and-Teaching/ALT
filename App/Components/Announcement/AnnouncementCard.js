import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { ListItem } from 'react-native-elements'
import Dimensions from '../../Utils/Dimensions';

export default class AnnouncementCard extends Component{

    render(){
        return(

            <View>
                <ListItem
                    title = {this.props.announcement.heading}
                    titleStyle={styles.title}
                    subtitle={this.props.announcement.description}
                    subtitleStyle={styles.caption}
                    containerStyle={styles.container}
                    badge = {{value : <Text style={{color:"white", fontSize:10}}>{"  "+this.props.announcement.date+"  "}</Text>, containerStyle : styles.date}}
                    bottomDivider
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(6),
        marginTop: 6,
        marginBottom: 6,
        paddingTop : 6,
        paddingBottom : 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.50,
        elevation: 1,
        borderRadius: 15,
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        color:'black',
        marginTop: 1,
        paddingTop : 1,
        marginBottom: 8,
        paddingBottom : 8,
        fontWeight : "bold"
    },
    date: {
        position : 'absolute',
        top : 8,
        right : 4
        // marginTop: 0,
        // paddingTop : 0,
        // marginBottom: 30,
        // paddingBottom : 30,
    },
    caption: {
        fontSize: 12,
        color:'black'
    },
})
