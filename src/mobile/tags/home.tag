mk-home
	mk-home-timeline(event={ tl-event })

style.
	display block

	> mk-home-timeline
		max-width 600px
		margin 0 auto

	@media (min-width 500px)
		padding 16px

script.
	@event = @opts.event

	@tl-event = riot.observable!

	@tl-event.on \loaded ~>
		@event.trigger \loaded
