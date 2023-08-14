
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
    // fetch("http://localhost:9000/mongoAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className='App' >
        <p className="App-intro">yo bro sick {this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;