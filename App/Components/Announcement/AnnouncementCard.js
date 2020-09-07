import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { ListItem, Badge } from 'react-native-elements'
import Dimensions from '../../Utils/Dimensions';

export default class AnnouncementCard extends Component{

    render(){
        return(

            <View>
                <ListItem
                    containerStyle={styles.container}
                    bottomDivider
                >
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {this.props.announcement.heading}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.caption}>
                            {this.props.announcement.description}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <Badge
                        value = {"  "+this.props.announcement.date+"  "}
                        containerStyle = {styles.date}
                        textStyle={{color:"white", fontSize:11}}
                    />
                </ListItem>
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
