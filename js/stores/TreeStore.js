/*
 * TreeStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TreeConstants = require('../constants/TreeConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _root;



function TreeItem(parent, text) {
	this.text = text;
	this.children = [];
	this.parent = parent;
	this.level = parent && parent.level + 1 || 0;
	this.collapsed = false;
}

TreeItem.prototype.removeChild = function(child) {
	var index = this.children.indexOf(child);
	if (~index) {
		this.children.splice(index, 1);
	}
}

TreeItem.prototype.remove = function() {
	this.parent && this.parent.removeChild(this);
}

TreeItem.prototype.add = function(text) {
	var child = new TreeItem(this, text);
	this.children.push(child);
	return child;
}
TreeItem.prototype.toggle = function() {
	this.collapsed = !this.collapsed;
}



TreeItem.prototype.plain = function(text) {
	return _.chain([
		this.parent && this,
		!this.collapsed && this.children.map(function(child) {
			return child.plain();
		})
	]).flatten(true)
	.compact()
	.value();
}

TreeItem.prototype.pack = function() {
	return [
		this.text,
		this.children.map(function(child) {
			return child.pack();
		})
	]
}


TreeItem.prototype.unpack = function(data) {
	this.text = _.first(data);
	this.children = _.last(data).map(function(subData) {
		return new TreeItem(this).unpack(subData);
	}, this);
	return this;
}


_root = new TreeItem();

function fromStorage() {
	if(typeof(Storage) !== "undefined") {
		try {
			var storageData = localStorage.treeData;
			if (storageData) {
				_root.unpack(JSON.parse(storageData));
			}
		} catch (e) {
			console.error(e.message);
		}
	} else {
		console.warn("There's no local storage");
	}
}

function toStorage() {
	if(typeof(Storage) !== "undefined") {
		try {
			localStorage.treeData = JSON.stringify(_root.pack());
		} catch (e) {
			console.error(e.message);
		}
	}
}

var TreeStore = assign({}, EventEmitter.prototype, {

	/**
	 * Get the entire collection of Tree.
	 * @return {object}
	 */
	getTree: function() {
		return _root;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
	var item;
	var text;

	switch(action.actionType) {
		case TreeConstants.TREE_ADD_ITEM:
			item = action.parent;
			item.add();
			item.collapsed = false;
			toStorage();
			TreeStore.emitChange();
			break;

		case TreeConstants.TREE_UPDATE_ITEM:
			item = action.item;
			item.text = action.text.trim();
			toStorage();
			TreeStore.emitChange();
			break;

		case TreeConstants.TREE_REMOVE_ITEM:
			item = action.item;
			item.remove();
			toStorage();
			TreeStore.emitChange();
			break;

		case TreeConstants.TREE_TOGGLE_ITEM:
			item = action.item;
			item.toggle();
			TreeStore.emitChange();
			break;

		case TreeConstants.TREE_LOAD_FROM_STORE:
			fromStorage();
			TreeStore.emitChange();
			break;


		default:
			// no op
	}
});

module.exports = TreeStore;
