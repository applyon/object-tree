var React = require('react');
var ReactPropTypes = React.PropTypes;
var TreeActions = require('../actions/TreeActions');
var TreeTextInput = require('./TreeTextInput.react');
var _ = require('lodash');

var cx = require('react/lib/cx');

var TreeItem = React.createClass({

	propTypes: {
	 item: ReactPropTypes.object.isRequired,
	 children: ReactPropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	/**
	 * @return {object}
	 */
	render: function() {
		var item;
		var children;
		var input;
		var tools;
		var toggler;

		var treeItem = this.props.item;
		var subItems = this.props.children || treeItem.children;
		var isEditing = this.state.isEditing;
		var hover =  this.state.hover;
		var collapsed = this.props.item && this.props.item.collapsed;

		var showTools = hover && !isEditing;
		var hasChildren = subItems.length;
		var renderChildren = hasChildren && !collapsed && this.props.children;
		var showToggler = !isEditing && treeItem && treeItem.parent && hasChildren;
		var level = treeItem && treeItem.level || 0;

		if (showToggler) {
			toggler = (<button className="btn btn-xs toggle" onClick={this._toggle}><i className={cx({
						"glyphicon": 1,
						"glyphicon-plus": treeItem.collapsed,
						"glyphicon-minus": !treeItem.collapsed,
					})}></i></button>
			)
		}

		if (treeItem) {
			if (isEditing) {
				input = <TreeTextInput
					className="edit form-control"
					onSave={this._onSave}
					value={this.props.item.text}
				/>;
			}
			if (showTools) {
				tools = ( 
					<div className="tools">
						<button className="btn btn-xs btn-success" onClick={this._add}>Add subitem</button>
						<button className="btn btn-xs btn-danger" onClick={this._remove}>Remove item</button>
					</div>
				);
			}
			item = (<div className="item-title" onDoubleClick={this._onDoubleClick} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff}>
				{
					_.range(1, level+1).map(function(index) {
						return (
							<div className="tab">
								{index === level && toggler}
							</div>
						)
					})
				}
				{this.props.item.text || '<input value>'}
				{tools}
				{input}
			</div>);
		}
		
		if (renderChildren) {
			children = (<ul className="item-children list-group">
				{
					renderChildren.map(function(item) {
						return (<li className="list-group-item"><TreeItem item={item} children={item.children} /></li>);
					})
				}
			</ul>);
		}
		return (
			<div className={cx({
				"item-content": 1,
				"collapsed": collapsed,
				"empty": !children,
				"root": !this.parent
			})}>
				{item}
				{children}
			</div>
		);
	},

	_onToggleComplete: function() {
		TreeActions.toggleComplete(this.props.todo);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	/**
	 * Event handler called within TreeTextInput.
	 * Defining this here allows TreeTextInput to be used in multiple places
	 * in different ways.
	 * @param	{string} text
	 */
	_onSave: function(text) {
		TreeActions.updateItem(this.props.item, text);
		this.setState({isEditing: false});
	},
	
	_hoverOn: function() {
		this.setState({hover: true});
	},

	_hoverOff: function() {
		this.setState({hover: false});
	},
	_add: function() {
		TreeActions.addItem(this.props.item);
	},
	_remove: function() {
		TreeActions.removeItem(this.props.item);
	},
	_toggle: function() {
		TreeActions.toggleItem(this.props.item);
	}

});

module.exports = TreeItem;
