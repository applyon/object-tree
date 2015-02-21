var Footer = require('./Footer.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TreeStore = require('../stores/TreeStore');

function getTreeState() {
	return {
		root: TreeStore.getTree()
	};
}

var TreeApp = React.createClass({

	getInitialState: getTreeState,

	componentDidMount: function() {
		TreeStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		TreeStore.removeChangeListener(this._onChange);
	},

	/**
	 * @return {object}
	 */
	render: function() {
		return (
			<div>
				<MainSection
					tree={this.state.root}
				/>
				<Footer tree={this.state.root} />
			</div>
		);
	},

	/**
	 * Event handler for 'change' events coming from the TreeStore
	 */
	_onChange: function() {
		this.setState(getTreeState());
	}

});

module.exports = TreeApp;
