import React, {Component} from 'react';
import FeedbackForm from './FeedbackForm';

export default class FeedbackFacultyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
        };
    }
    render() {
        return (
            <FeedbackForm course={this.state.course} user={this.state.user}/>
        )
    }
}
