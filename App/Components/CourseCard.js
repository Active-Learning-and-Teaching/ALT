import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { Tile } from 'react-native-elements'
import Dimensions from '../Utils/Dimensions';
import {CoursePics} from '../Utils/CoursePics';

export default class  CourseCard extends Component{

    getImage = () =>{
        return CoursePics(this.props.imageURL)
    }

    render(){
        return(
            <Tile
                onPress={()=>{
                    this.props.navigation.navigate('Course DashBoard',{
                        course: this.props.coursename
                    })
                }}
                imageSrc={this.getImage()}
                imageContainerStyle={styles.imageContainer}
                activeOpacity={0.7}
                title = {this.props.coursename}
                titleStyle={styles.title}
                caption={this.props.instructor}
                captionStyle={styles.caption}
                containerStyle={styles.container}
                featured
            />
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(3.5),
        marginTop: 8,
        marginBottom: 8,
        paddingTop : 8,
        paddingBottom : 8
    },
    imageContainer: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(3.5),
        borderRadius: 20,
        overflow: 'hidden',
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        fontSize: 22,
        top: 15,
        color:'white'
    },
    caption: {
        position: 'absolute',
        left: 15,
        bottom: 15,
        fontSize: 18,
        color:'white'
    },
})
