import React, { Component } from 'react';

class Public extends Component {
    state = {
        message: ''
    }

    componentDidMount() {
        fetch('/public').then(res => {
            if (res.ok) return res.json();
            throw new Error('Network response was not okay');
        })
            .then(res => this.setState({message: res.message}))
            .catch(err => this.setState({message: err.message}));

    }

    render() {
        return (
            <p>{this.state.message}</p>
        );
    }
}

export default Public;