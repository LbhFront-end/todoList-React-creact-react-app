import './style/App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './components/Index/index'
import AddList from './components/addList/index';
import ChangeList from './components/changeList/index';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="main">
          <Route exact path="/" component={Index} />
          <Route path="/AddList" component={AddList} />
          <Route path="/ChangeList/:id" component={ChangeList} />
        </div>
      </Router>
    );
  }
}

export default App;
