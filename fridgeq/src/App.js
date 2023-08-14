import React, { Component } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Fridge from './Fridge';
import Navbar from './Navbar';

class App extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = { apiResponse: "" };
  // }

  // callAPI() {
  //   fetch("http://localhost:9000/testAPI")
  //   // fetch("http://localhost:9000/mongoAPI")
  //     .then(res => res.text())
  //     .then(res => this.setState({ apiResponse: res }));
  // }

  // componentWillMount() {
  //   this.callAPI();
  // }

  render() {
    return (
      <BrowserRouter>
        <div className='App'>
          <div className='background'></div>
          <div className="content">
            <Routes>
              <Route path="/fridge" element={<Fridge/>}/>
            </Routes>
          </div>
        </div>
        <Navbar/>
      </BrowserRouter>
    );
  }
}

export default App;