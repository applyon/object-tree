"use strict";


jest.autoMockOff();

var _ = require('lodash');

describe('AppDispatcher', function() {
	var AppDispatcher;

	beforeEach(function() {
		AppDispatcher = require('../AppDispatcher.js');
	});

	it('sends actions to subscribers', function() {
		var listener = jest.genMockFunction();
		AppDispatcher.register(listener);

		var payload = {};
		AppDispatcher.dispatch(payload);
		expect(listener.mock.calls.length).toBe(1);
		expect(listener.mock.calls[0][0]).toBe(payload);
	});

	it('waits with chained dependencies properly', function() {
		var payload = {};
		
		var listeners = [
			{
				dependsOn: [1, 3],
				check: [1, 2, 3]
			},
			{
				dependsOn: [2],
				check: [2]
			},
			{
				dependsOn: [],
				check: []
			},
			{
				dependsOn: [2],
				check: [2]
			}
		];
		listeners.forEach(function(listener) {
			_.extend(
				listener,
				{
					index: AppDispatcher.register(function() {
						AppDispatcher.waitFor(
							listener.dependsOn.map(function(dep) {
								return listeners[dep].index;
							})
						);
						listener.check.forEach(function(check) {
							expect(listeners[check].done).toBe(true);
							
						});
						listener.done = true;	
					})
				}
			);
		});

		runs(function() {
			AppDispatcher.dispatch(payload);
		});

		waitsFor(function() {
			return listeners[0].done;
		}, "Not all subscribers were properly called", 500);

		runs(function() {
			_.range(0, 4).forEach(function(listener) {
				expect(listeners[listener].done).toBe(true);
			});
		});
	});
});
