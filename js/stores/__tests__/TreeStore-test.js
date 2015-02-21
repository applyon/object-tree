"use strict";


jest.autoMockOff();
var _ = require('lodash');

describe('TreeStore', function() {
	var TreeStore;
	var TreeActions;
	var tree;
	beforeEach(function() {
		TreeStore = require('../TreeStore');
		TreeActions = require('../../actions/TreeActions');
		tree = TreeStore.getTree();
	})

	function isTreeItem(item) {
		expect(typeof(item)).toBe('object');
		expect(item.constructor.name).toBe('TreeItem');
	};

	it('should init tree', function() {
		isTreeItem(tree);
		expect(tree.plain().length).toBe(0);
	});

	it('should add item', function() {
		TreeActions.addItem(tree);
		var plain = tree.plain();
		expect(plain.length).toBe(1);
		var item = plain[0];
		isTreeItem(item);
		expect(item.text).toBe(undefined);
		expect(item.collapsed).toBe(false);
	});

	it('should add subitems', function() {
		TreeActions.addItem(tree);
		var plain = tree.plain();
		var item = plain[0];
		TreeActions.addItem(item);

		plain = tree.plain();
		var itemPlain = item.plain();

		expect(plain.length).toBe(2);
		expect(itemPlain.length).toBe(2);

		var subitem = _.last(plain);

		isTreeItem(subitem);
		expect(subitem).toBe(_.last(itemPlain));
		expect(subitem.plain().length).toBe(1);
	});

	it('should update item', function() {
		var text = 'test';

		TreeActions.addItem(tree);
		var item = _.last(tree.plain());
		TreeActions.updateItem(item, text);
		
		expect(item.text).toBe(text);
	});

	it('should toggle item', function() {
		TreeActions.addItem(tree);
		var item = _.last(tree.plain());

		TreeActions.toggleItem(item);
		expect(item.collapsed).toBe(true);

		TreeActions.toggleItem(item);
		expect(item.collapsed).toBe(false);
	});
})
