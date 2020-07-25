import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { Tile } from 'react-native-elements'
import Dimensions from '../../Utils/Dimensions';
import {CoursePics} from '../../Utils/CoursePics';

export default class  CourseCard extends Component{
    constructor() {
        super();
        this.state = {
            image : ""
        };
    }

    getImage = () =>{
        this.setState({
            image : CoursePics(this.props.course.imageURL)
        })
    }

    componentDidMount() {
        this.getImage()
    }

    render(){
        return(
            <Tile
                onPress={()=>{
                    this.props.navigation.navigate('Course', {
                        type : this.props.type,
                        user : this.props.user,
                        course : this.props.course
                })}}
                imageSrc={this.state.image}
                imageContainerStyle={styles.imageContainer}
                activeOpacity={0.7}
                title = {this.props.course.courseName}
                titleStyle={styles.title}
                caption={this.props.course.instructor}
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
