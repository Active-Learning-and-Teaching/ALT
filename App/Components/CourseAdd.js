import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import {
    Text,
    View,
    Button,
    TouchableHighlight, StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import Dimensions from '../Utils/Dimensions';
import FormAddCourse from './FormAddCourse';

export default class  AddCourse extends Component {

    constructor() {
        super();
        this.state = {
            visible : false,
        }
        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal() {
        this.setState({
            visible : !this.state.visible
        })
    };

    render(){
        return (
            <View>
                <Icon name='plus-circle' type='font-awesome' style={{borderRadius:1}} onPress={this.toggleModal} />
                {/*<Button style={styles.buttonMessage} title="Add Course" onPress={this.toggleModal} />*/}
                {/*<Icon name='plus' type='font-awesome' style={{borderRadius:1}} onPress={this.toggleModal} />*/}

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.visible}
                    style = {styles.modalStyle}
                    onBackdropPress = {this.toggleModal}
                    onBackButtonPress= {this.toggleModal}
                    avoidKeyboard>
                    <View style={{flex: 1}}>
                        <FormAddCourse toggle={this.toggleModal}/>
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

