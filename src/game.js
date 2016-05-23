"use strict";

var globalSettings = {level:"level1"};

// Global namespace for our game.
var game = {
	screenHeight : 640,
	screenWidth : 960,
	options : {},
	onload : function() {
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

		// add "?nodie=1" to have an easier time
		// add "?skipintro=1" to skip the radmars animation
		// add "?debug=1" to the URL to enable the debug Panel
		if (this.options.debug) {
			window.onReady(function () {
				me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
			});
		}

		me.audio.init("m4a,ogg");
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(GameResources);
		me.state.change(me.state.LOADING);
	},
	loaded : function() {
		this.playState = new PlayScreen(this);
		me.state.set(me.state.INTRO, new RadmarsScreen(this));
		me.state.set(me.state.MENU, new TitleScreen(this));
		me.state.set(me.state.GAMEOVER, new GameOverScreen(this));
		me.state.set(me.state.GAME_END, new GameWinScreen(this));
		me.state.set(me.state.PLAY, this.playState);

		var volume = 1;

		if(this.options.level) {
			this.playState.setNextLevel(this.options.level);
		}
		if(this.options.nodie) {
			this.playState.nodie = true;
		}
		if(this.options.mute) {
			volume = 0.0;
		}
		me.audio.setVolume(volume);

		me.pool.register("mainPlayer", PlayerEntity);
		me.pool.register("shooter", EnemyShooter, true);
		me.pool.register("pouncer", EnemyPouncer, true);
		me.pool.register("bomber", EnemyBomber, true);
		me.pool.register("boss", EnemyBoss, true);
		me.pool.register("meatGlob", MeatGlob, true);
		me.pool.register("enemySpawn", EnemySpawnPoint, true);
		me.pool.register("boneProjectile", BoneProjectile, true);
		me.pool.register("playerBloodProjectile", PlayerBloodProjectile, true);
		me.pool.register("bulletBomber", BulletBomber, true);
		me.pool.register("bulletShooter", BulletShooter, true);
		me.pool.register("bulletBoss", BulletBoss, true);
		me.pool.register("destructable", Destructable, true);
		me.pool.register("levelChanger", LevelChanger, true);
		me.pool.register("dog", Dog, true);

		if (this.options.skipintro) {
			me.state.change(me.state.PLAY);
		}
		else {
			me.state.change(me.state.INTRO);
		}
	}
}