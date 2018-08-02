import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

export default createReactClass({
  displayName: 'DeleteLink',

  propTypes: {
    tweet: PropTypes.object.isRequired
  },

  onClick() {
    const { tweet } = this.props;

    lore.dialog.show(function() {
      return lore.dialogs.tweet.destroy(tweet, {
        blueprint: 'optimistic',
        request: function(data) {
          return lore.actions.tweet.destroy(tweet).payload;
        }
      });
    });
  },

  render() {
    return (
      <a className="link" onClick={this.onClick}>
        delete
      </a>
    );
  }

});
