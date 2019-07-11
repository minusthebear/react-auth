import React, { Component } from 'react';

class Courses extends Component {
    state = {
        courses: [],
        message: ''
    }

    componentDidMount() {
        fetch('/course', {
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        }).then(res => {
            if (res.ok) return res.json();
            throw new Error('Network response was not okay');
        })
            .then(res => this.setState({courses: res.courses}))
            .catch(err => this.setState({message: err.message}));

        fetch('/admin', {
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        }).then(res => {
            if (res.ok) return res.json();
            throw new Error('Network response was not okay');
        })
            .then(res => console.log(res))
            .catch(err => this.setState({message: err.message}));

    }

    render() {
        return (
            <ul>
                {this.state.courses.map(course => {
                    return <li key={course.id}>{course.title}</li>;
                })}
            </ul>
        );
    }
}

export default Courses;