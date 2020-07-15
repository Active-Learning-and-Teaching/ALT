import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Dimensions from '../Utils/Dimensions';
import FormAddCourse from './FormAddCourse';
import StudentAddCourseForm from './StudentAddCourseForm';
import AnnouncementsAdd from './AnnouncementsAdd';

export default class  CourseAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
        }
        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal() {
        this.setState({
            visible : !this.state.visible
        })
        console.log(this.props.instructor)
        // console.log(this.props.route.params.instructor)
    };

    render(){
        return (
            <View>

                <View style={{padding:10}}>
                    {Platform.OS==='ios'
                    ?
                    <Icon name='plus' type='font-awesome' style={{borderRadius:1}} onPress={this.toggleModal} />
                    :
                    <Icon name='plus' type='font-awesome' style={{borderRadius:1, padding:10}} onPress={this.toggleModal} />
                    }
                </View>

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.visible}
                    style = {styles.modalStyle}
                    onBackdropPress = {this.toggleModal}
                    onBackButtonPress= {this.toggleModal}
                    avoidKeyboard>
                    <View style={{flex: 1}}>
                        { this.props.type==="faculty"
                            ?
                            <FormAddCourse toggle={this.toggleModal} instructor = {this.props.instructor} />
                        :
                            this.props.type==="student"
                                ?
                                <StudentAddCourseForm student = {this.props.student} toggle={this.toggleModal}/>
                        :
                                <AnnouncementsAdd course = {this.props.course} toggle={this.toggleModal}/>
                        }

                    </View>
                </Modal>
            </View>
        )
    }

};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#fff'
    },
    modalStyle : {
        backgroundColor:'white',
        maxHeight : Dimensions.window.height/1.25,
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    },
    buttonMessage: {
        paddingTop : 10,
        marginTop: 15
    }
});

