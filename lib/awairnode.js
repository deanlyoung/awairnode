var request = require('request');
/**
 * Leaving in for future development: timeframe queries
 *
 * var _ = require('underscore');
 */

var Awair = function(token, devType, devId) {
	"use strict";
	
	var that = this;
	
	that.chainedRequests = [];
	
	that.scoreLatest = function() {
		this.chainedRequests.push("air-data/latest");
		return this;
	};
	
	that.fiveMinAvg = function() {
		this.chainedRequests.push("air-data/5-min-avg?limit=1&desc=true");
		return this;
	};
	
	that.fifteenMinAvg = function() {
		this.chainedRequests.push("air-data/15-min-avg?limit=1&desc=true");
		return this;
	};
	
	/**
	* Performs the actual request
	*
	* @param devId			device ID
	* @param devType		device type (awair / awair-glow / awair-mint / awair-omni / awair-r2)
	* @param callback		function
	*/
	
	that.request = function(devType, devId, callback){
		// A little pre-query validation
		if (!devType){
			callback(true, "You must supply a valid devType");
			return;
		} else if (!devId){
			callback(true, "You must supply a valid devId");
			return;
		} else if (!that.chainedRequests.length){
			callback(true,  "You must specify a resource to request first (e.g. awair.latestScore().request...)");
			return;
		} else if (!_.isFunction(callback)){
			throw "The second argument must be a function";
		}
		
		// Construct the url
		var url = 'http://developer-apis.awair.is/v1/users/self/devices/' + devType + '/' + devId + '/' + that.chainedRequests.join('');
		//var options = {
			//headers: {
				//'Authorization': 'Bearer ' + token
			//}
		//};
		that.chainedRequests = [];
		
		// Request the url
		request.get(url, function (error, response, body) {
			var json = false;
			if (!error && response.statusCode === 200) {
				error = false;
				try {
					json = JSON.parse(body);
				} catch (err) {
					console.error('Exception caught in JSON.parse', body);
					error = err;
				}
			}
			callback.call(that, error, json);
			return;
		});
	};
};

module.exports = Awair;