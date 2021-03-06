import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CreateButton from './CreateButton';

export default createReactClass({
  displayName: 'Header',

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top header">
        <div className="container">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">
              Lore Custom Hook Tutorial
            </Link>
          </div>
          <CreateButton/>
        </div>
      </nav>
    );
  }

});
