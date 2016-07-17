mk-ui
	mk-post-form(ui={ui})

	mk-global@global
		mk-header@header(ui={ui})

		mk-contents
			| <yield/>

	mk-go-top

script.
	@ui = riot.observable!

	@ui.on \on-blur ~>
		$global = $ @global
		$ {blur-radius: 0} .animate {blur-radius: 5} do
			duration: 100ms
			easing: \linear
			step: -> $global.css do
				'-webkit-filter': "blur("+@blur-radius+"px)"
				'-moz-filter':    "blur("+@blur-radius+"px)"
				'filter':         "blur("+@blur-radius+"px)"

	@ui.on \off-blur ~>
		$global = $ @global
		$ {blur-radius: 5} .animate {blur-radius: 0} do
			duration: 100ms
			easing: \linear
			step: -> $global.css do
				'-webkit-filter': "blur("+@blur-radius+"px)"
				'-moz-filter':    "blur("+@blur-radius+"px)"
				'filter':         "blur("+@blur-radius+"px)"
			complete: -> $global.css do
				'-webkit-filter': ""
				'-moz-filter':    ""
				'filter':         ""

	@on \mount ~>
		@$header = $ @header
		$ \body .css \margin-top @$header.outer-height! + \px

	$ window .on 'load scroll resize' @on-scroll

	@on-scroll = ~>
		t = $ window .scroll-top!
		opacity = t / 128
		if opacity > 0.3 then opacity = 0.3
		@$header.css \box-shadow "0 0 1px rgba(0, 0, 0, " + opacity + ")"
