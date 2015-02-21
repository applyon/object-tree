/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');

var TreeApp = require('./components/TreeApp.react');
var TreeActions = require('./actions/TreeActions');

TreeActions.loadFromStore();

React.render(
	<TreeApp />,
	document.getElementById('treeapp')
);
