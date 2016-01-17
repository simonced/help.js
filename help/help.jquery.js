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

	// current step (bubbles displayed one by one)
	step: 0,

	// bootstrap function
	init: function(url_, trigger_) {
		if(Help.scenario) {
			Help.activate();
		}
		else {
			// fist call:

			// trigger settup
			this.trigger = trigger_;
			this._loadScenario(url_);

			// events
			$('body').on('click', '.help-next', Help.next);
			$('body').on('click', '.help-prev', Help.prev);
		}
	},

	// activate the help, scenario should be loaded before!
	activate: function() {
		if(!this.active) {
			// ON
			this.active = true;
			this.trigger.addClass('active');

			// current scenario step block
			var block = this.scenario.blocks[this.step];

			// target selector
			var target = $(block.selector);
			if(target.length>0) {
				// === border ===
				var helpBorder = $("<div class='help-box'></div>");
				helpBorder.css({
					"top": target.offset().top - (this.scenario.borderPadding/2),
					"left": target.offset().left - (this.scenario.borderPadding/2),
					"width": (target.width() + this.scenario.borderPadding),
					"height": (target.height() + this.scenario.borderPadding)
				});
				$("body").append(helpBorder);

				// === bubble >>>

				// message
				var helpBubble = $("<div class='help-bubble'>"+block.message+"</div>");

				// nav
				var bubbleNav = $("<div><hr></div>");
				if(this.step>0) {
					// if we have a bubble after, we add a "next" button
					bubbleNav.append($("<a href='#prev-bubble' class='button-help help-prev'>Previous</a>"));
				}
				if(this.scenario.blocks[this.step+1]) {
					// if we have a bubble before, we add a "next" button
					bubbleNav.append($("<a href='#next-bubble' class='button-help help-next'>Next</a>"));
				}
				helpBubble.append(bubbleNav);

				// position
				$("body").append(helpBubble);
				var bubblePosition = {};

				if(block.position==='left') {
					bubblePosition.left = target.offset().left - helpBubble.innerWidth();
				}
				if(block.position==='right') {
					bubblePosition.left = target.offset().left + target.innerWidth();
				}
				if(block.position==='above') {
					bubblePosition.top = target.offset().top - helpBubble.innerHeight();
				}
				if(block.position==='below') {
					bubblePosition.top = target.offset().top+target.innerHeight();
				}

				// align
				if(block.align==='right') {
					bubblePosition.left = target.offset().left + target.innerWidth() - helpBubble.innerWidth();
				}
				if(block.align==='left') {
					bubblePosition.left = target.offset().left;
				}
				if(block.align==='top') {
					bubblePosition.top = target.offset().top;
				}
				if(block.align==='bottom') {
					bubblePosition.top = target.offset().top + target.innerHeight() - helpBubble.innerHeight();
				}

				helpBubble.css(bubblePosition);
				// <<< bubble position and size
			}
		}
		else {
			// OFF
			this.active = false;
			this.trigger.removeClass("active");
			// destroy boxes
			$(".help-box, .help-bubble").remove();
		}
	},


	/**
	 * JQUERY event
	 * Next bubble display
	 *
	 * @author Simonced
	 * @param event e_
	 */
	prev: function(e_) {
		e_.preventDefault();
		--Help.step;
		Help.activate();
		Help.activate();
	},


	/**
	 * JQUERY event
	 * Next bubble display
	 *
	 * @author Simonced
	 * @param event e_
	 */
	next: function(e_) {
		e_.preventDefault();
		++Help.step;
		Help.activate();
		Help.activate();
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
