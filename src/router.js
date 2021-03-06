import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import LoginPage from "./routes/loginPage";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/beta" component={LoginPage} />
    </Router>
  );
}

export default RouterConfig;
