var React = require('react');
var ReactPropTypes = React.PropTypes;
var TreeActions = require('../actions/TreeActions');

var Footer = React.createClass({

	propTypes: {
		tree: ReactPropTypes.object.isRequired
	},

	/**
	 * @return {object}
	 */
	render: function() {
		return (<div className="tools">
			<button className="btn btn-success" onClick={this._add}>Add item</button>
		</div>);
	},

	/**
	 * Event handler to add tree item
	 */
	_add: function() {
		TreeActions.addItem(this.props.tree);
	}

});

module.exports = Footer;
