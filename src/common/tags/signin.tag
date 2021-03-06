mk-signin
	form(onsubmit={ onsubmit })
		h1
			img@avatar(src={ user.avatar_url + '?thumbnail&size=32' }, if={ user })
			p { user ? user.name : 'アカウント' }
		label.user-name
			input@username(
				type='text'
				pattern='^[a-zA-Z0-9\-]+$'
				placeholder='ユーザー名'
				autofocus
				required
				oninput={ oninput })
			i.fa.fa-at
		label.password
			input@password(
				type='password'
				placeholder='パスワード'
				required)
			i.fa.fa-lock
		button(type='submit') サインイン

style.
	display block

	> form
		display block
		z-index 2

		> h1
			display block
			margin 0
			padding 0
			height 54px
			line-height 54px
			text-align center
			text-transform uppercase
			font-size 1em
			font-weight bold
			color rgba(0, 0, 0, 0.5)
			border-bottom solid 1px rgba(0, 0, 0, 0.1)

			> p
				display inline
				margin 0
				padding 0

			> img
				display inline-block
				top 10px
				width 32px
				height 32px
				margin-right 8px
				border-radius 100%

				&[src='']
					display none

		label
			display block
			margin 12px 0

			i
				display block
				pointer-events none
				position absolute
				bottom 0
				top 0
				left 0
				z-index 1
				margin auto
				padding 0 16px
				height 1em
				color #898786

			input[type=text]
			input[type=password]
				user-select text
				display inline-block
				cursor auto
				padding 0 0 0 38px
				margin 0
				width 100%
				line-height 44px
				font-size 1em
				color rgba(0, 0, 0, 0.7)
				background #fff
				outline none
				border solid 1px #eee
				border-radius 4px

				&:hover
					background rgba(255, 255, 255, 0.7)
					border-color #ddd

					& + i
						color #797776

				&:focus
					background #fff
					border-color #ccc

					& + i
						color #797776

		[type=submit]
			cursor pointer
			padding 16px 16px 32px 16px
			margin -6px 0 0 0
			width 100%
			font-size 1.2em
			color rgba(0, 0, 0, 0.5)
			outline none
			border none
			border-radius 0
			background transparent
			transition all .5s ease

			&:hover
				color $theme-color
				transition all .2s ease

			&:focus
				color $theme-color
				transition all .2s ease

			&:active
				color darken($theme-color, 30%)
				transition all .2s ease

script.
	@mixin \api

	@user = null

	@oninput = ~>
		@api \users/show do
			username: @refs.username.value
		.then (user) ~>
			@user = user
			@update!

	@onsubmit = (e) ~>
		e.prevent-default!

		@api \signin do
			username: @refs.username.value
			password: @refs.password.value
		.then ->
			location.reload!
		.catch ->
			alert 'something happened'

		false
