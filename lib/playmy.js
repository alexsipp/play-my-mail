var EventEmitter = require("events").EventEmitter,
    util = require('util');

/**
 * Main class
 * @param {Object} options
 * @constructor
 */
function PlayMy(options) {
  	PlayMy.super_.call(this);

	this.api_host = options.mxm_api.api_host;
	this.api_key = options.mxm_api.api_key;
}

util.inherits(PlayMy, EventEmitter);

module.exports = PlayMy;

require('./tracks');
require('./helpers');
require('./email');
require('./process');
require('./artists');
require('./text_proc');
require('./spotify');



