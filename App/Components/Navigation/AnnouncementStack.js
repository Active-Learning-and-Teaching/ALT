import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import Announcement from '../Announcement/Announcement';
import CourseAdd from '../Dashboard/CourseAdd';

const Stack = createStackNavigator();

export default class AnnouncementStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTA: null,
            type: this.props.route.params.type,
            user: this.props.route.params.user,
            course: this.props.route.params.course,
        }
    }
    async setIsTA() {
        const AllTAs = Object.keys(this.state.course.TAs)
        AllTAs.forEach(element => {
            isTA=false||element.includes(this.state.user.url)
        });
        await this.setState({
            isTA: isTA,
        })
        console.log(this.state.isTA)
    }
    componentDidMount(){
        this.setIsTA()
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name='Announcements'
                       component={Announcement}
                       options={{
                           headerTitle : null,
                           headerShown : true,
                           headerBackTitle: '',
                           headerRight : ()=>(
                               this.state.type==='faculty'||this.state.isTA ?
                                   <CourseAdd
                                       course ={this.state.course}
                                   />
                                   : null
                           )
                       }}
                       initialParams={{
                           type : this.state.type,
                           user: this.state.user,
                           course: this.state.course
                       }}
                />
            </Stack.Navigator>
        )
    }
}
