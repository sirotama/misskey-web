#================================
# Boot loader
#================================

riot = require \riot

api = require './common/scripts/api.ls'
generate-default-userdata = require './common/scripts/generate-default-userdata.ls'

boot = (_i, cb) ~>
	me = null

	if not _i?
		return done!

	# ユーザー情報フェッチ
	fetch "#{CONFIG.api.url}/i" do
		method: \POST
		headers:
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		body: "_i=#_i"
	.then (res) ~>
		if res.status != 200
			alert 'ユーザー認証に失敗しました。ログアウトします。'
			location.href = CONFIG.urls.signout
			return

		i <~ res.json!.then
		me := i
		me._web = _i

		if me.data?
			done!
		else
			init!
	.catch (e) ~>
		console.error e
		info = document.create-element \mk-core-error
			|> document.body.append-child
		riot.mount info, do
			refresh: ~> boot cb

	function done
		init = document.get-element-by-id \init
		init.parent-node.remove-child init

		document.create-element \div
			..set-attribute \id \kyoppie
			.. |> document.body.append-child

		if cb? then cb me

	function init
		data = generate-default-userdata!

		api _i, \i/appdata/set do
			data: JSON.stringify data
		.then ~>
			me.data = data
			done!

module.exports = boot
