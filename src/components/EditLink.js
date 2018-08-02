import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

export default createReactClass({
  displayName: 'EditLink',

  propTypes: {
    tweet: PropTypes.object.isRequired
  },

  onClick() {
    const { tweet } = this.props;

    lore.dialog.show(function() {
      return lore.dialogs.tweet.update(tweet, {
        blueprint: 'optimistic',
        request: function(data) {
          return lore.actions.tweet.update(tweet, data).payload;
        }
      });
    });
  },

  render() {
    return (
      <a className="link" onClick={this.onClick}>
        edit
      </a>
    );
  }

});
