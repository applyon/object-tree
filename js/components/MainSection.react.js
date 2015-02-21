var React = require('react');
var ReactPropTypes = React.PropTypes;
var TreeActions = require('../actions/TreeActions');
var TreeItem = require('./TreeItem.react');

var MainSection = React.createClass({

	propTypes: {
		tree: ReactPropTypes.object.isRequired
	},

	/**
	 * @return {object}
	 */
	render: function() {
		var tree = this.props.tree;
		var items = tree.children;
		var plain = tree.plain().map(function(item) {
				return (<li className="list-group-item">
					<TreeItem item={item} children={null} />
				</li>);
			});

		return (
			<section id="main">
				<h3>Plain items</h3>
				<ul id="plain-items" className="list-group">
					{plain}
				</ul>
				<h3>Tree items</h3>
				<TreeItem item={null} children={items} />
			</section>
		);
	}
});

module.exports = MainSection;
