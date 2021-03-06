mk-notifications-page
	mk-ui: mk-notifications(event={ parent.event })

style.
	display block

script.
	@mixin \ui
	@mixin \ui-progress

	@event = riot.observable!

	@on \mount ~>
		document.title = 'Misskey | 通知'
		@ui.trigger \title '<i class="fa fa-bell-o"></i>通知'

		@Progress.start!

	@event.on \loaded ~>
		@Progress.done!
