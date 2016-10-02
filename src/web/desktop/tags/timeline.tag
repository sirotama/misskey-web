mk-timeline
	virtual(each={ _post, i in posts })
		mk-post(post={ _post })
		p.date(if={ i != posts.length - 1 && _post._date != posts[i + 1]._date })
			span
				i.fa.fa-angle-up
				| { _post._datetext }
			span
				i.fa.fa-angle-down
				| { posts[i + 1]._datetext }
	footer(data-yield='footer')
		| <yield from="footer"/>

style.
	display block

	> mk-post
		border-bottom solid 1px #eaeaea

		&:first-child
			border-top-left-radius 4px
			border-top-right-radius 4px
		
		&:last-of-type
			border-bottom none

	> .date
		display block
		margin 0
		line-height 32px
		text-align center
		color #aaa
		background #fdfdfd
		border-bottom solid 1px #eaeaea

		span
			margin 0 16px

		i
			margin-right 8px

	> footer
		padding 16px
		text-align center
		color #ccc
		border-top solid 1px #eaeaea
		border-bottom-left-radius 4px
		border-bottom-right-radius 4px

style(theme='dark').
	> mk-post
		border-bottom-color #222221

script.
	@posts = []
	@controller = @opts.controller

	@controller.on \set-posts (posts) ~>
		@posts = posts
		@update!

	@controller.on \prepend-posts (posts) ~>
		posts.for-each (post) ~>
			@posts.push post
			@update!

	@controller.on \add-post (post) ~>
		@posts.unshift post
		@update!
	
	@controller.on \clear ~>
		@posts = []
		@update!

	@controller.on \focus ~>
		@tags['mk-post'].0.root.focus!

	@on \update ~>
		@posts.for-each (post) ~>
			date = (new Date post.created_at).get-date!
			month = (new Date post.created_at).get-month! + 1
			post._date = date
			post._datetext = month + '月 ' + date + '日'
