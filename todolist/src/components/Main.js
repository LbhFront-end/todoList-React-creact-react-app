import '../styles/App.css';
import 'react-flexible';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Index from '../components/Index/index.js'
import AddList from '../components/addList/index.js';
import ChangeList from '../components/changeList/index';

class AppComponent extends Component {
  render() {
    return (
      <Router>
        <div className="main">
          <Route exact path="/" component={Index} />
          <Route path="/AddList" component={AddList} />
          <Route path="/ChangeList/:id" component={ChangeList} />
        </div>
      </Router>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
