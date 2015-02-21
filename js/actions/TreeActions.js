/*
 * TreeActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TreeConstants = require('../constants/TreeConstants');

var TreeActions = {
	/**
	 * @param	{object} item The Tree item
	 * @param	{string} text
	 */
	updateItem: function(item, text) {
		AppDispatcher.dispatch({
			actionType: TreeConstants.TREE_UPDATE_ITEM,
			item: item,
			text: text
		});
	},
	/**
	 * @param	{object} parent The parent item
	 */
	addItem: function(parent) {
		AppDispatcher.dispatch({
			actionType: TreeConstants.TREE_ADD_ITEM,
			parent: parent
		});
	},
	/**
	 * @param	{object} item The Tree item
	 */
	removeItem: function(item) {
		AppDispatcher.dispatch({
			actionType: TreeConstants.TREE_REMOVE_ITEM,
			item: item
		});
	},
	/**
	 * @param	{object} item The Tree item
	 */
	toggleItem: function(item) {
		AppDispatcher.dispatch({
			actionType: TreeConstants.TREE_TOGGLE_ITEM,
			item: item
		});
	},
	/**
	 */
	loadFromStore: function() {
		AppDispatcher.dispatch({
			actionType: TreeConstants.TREE_LOAD_FROM_STORE,
		});
	}
};

module.exports = TreeActions;
