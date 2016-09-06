mk-notifications-home-widget
	p.title
		i.fa.fa-bell-o
		| 通知
	button(onclick={ settings }, title='通知の設定'): i.fa.fa-cog
	mk-notifications

style.
	display block
	position relative
	background #fff

	> .title
		position relative
		z-index 1
		margin 0
		padding 14px 16px
		line-height 1em
		font-size 0.9em
		font-weight bold
		color #888
		box-shadow 0 1px rgba(0, 0, 0, 0.07)

		> i
			margin-right 4px
	
	> button
		position absolute
		z-index 2
		top 0
		right 0
		padding 14px
		font-size 0.9em
		line-height 1em
		color #ccc

		&:hover
			color #aaa
		
		&:active
			color #999

	> mk-notifications
		max-height 300px
		overflow auto

script.
	@settings = ~>
		w = document.body.append-child document.create-element \mk-settings-window
		w-controller = riot.observable!
		riot.mount w, do
			controller: w-controller
		w-controller.trigger \switch \notification
		w-controller.trigger \open
