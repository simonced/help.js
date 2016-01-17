$('document').ready(function() {
	$('.button-help').click(function(e_) {
		e_.preventDefault();
		// link to scenario
		var scenarioUrl = $(this).attr('href');
		Help.init(scenarioUrl, $(this));
	});
});

var Help = {
	// Loaded scenario data
	scenario: null,

	// indicates of the current help is visible
	active: false,

	// activable help button (Jquery object)
	trigger: null,

	// bootstrap function
	init: function(url_, trigger_) {
		if(Help.scenario) {
			Help.activate();
		}
		else {
			// trigger settup
			this.trigger = trigger_;
			this._loadScenario(url_);
		}
	},

	// activate the help, scenario should be loaded before!
	activate: function() {
		if(!this.active) {
			// ON
			this.active = true;
			this.trigger.addClass('active');
			// TODO
			console.log( "Active bubbles!" );
		}
		else {
			// OFF
			this.active = false;
			this.trigger.removeClass('active');
		}
	},

	/**
	 * private loading of scenario
	 *
	 * @author Simonced
	 * @param string url_
	 */
	_loadScenario: function(url_) {
		$.getJSON(url_).done(function(json_) {
			// assign scenario
			Help.scenario = json_;
			Help.activate();
		}).fail(function() {
			console.log( "SERVER error..." );
		});
	}
};
