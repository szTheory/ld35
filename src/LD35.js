"use strict";

function LD35() {
	this.screenHeight = 640;
	this.screenWidth = 960;
	this.options = {};
}

LD35.prototype.onload = function() {
	// Load URL parameters
	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		this.options[key] = value;
	}.bind(this));

	// Initialize the video.
	if (!me.video.init(this.screenWidth, this.screenHeight, {
		wrapper: "screen",
		scale: 1.0,
	})) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "?debug" to the URL to enable the debug Panel
	if (this.options.debug) {
		window.onReady(function () {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
		});
	}

	me.audio.init("mp3,ogg");
	me.loader.onload = this.loaded.bind(this);
	me.loader.preload(GameResources);
	me.state.change(me.state.LOADING);
}

LD35.prototype.loaded = function() {
	// TODO: me.state.set(me.state.MENU, new TitleScreen());
	me.state.set(me.state.PLAY, new PlayScreen(this));

	me.pool.register("mainPlayer", PlayerEntity);
	me.pool.register("shooter", EnemyShooter);

	var keys = {
		left:  [me.input.KEY.LEFT, me.input.KEY.A],
		right: [me.input.KEY.RIGHT, me.input.KEY.D],
		up:    [me.input.KEY.UP, me.input.KEY.W],
		down:  [me.input.KEY.DOWN, me.input.KEY.S],
	};

	Object.keys(keys).forEach(function(k) {
		keys[k].forEach(function(code) {
			me.input.bindKey(code, k);
		})
	})

	// TODO This should go to title screeeen
	me.state.change(me.state.PLAY);
}
