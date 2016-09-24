# Update Banner
#================================

riot = require 'riot'
dialog = require './dialog.ls'

module.exports = (cb) ~>
	browser = document.body.append-child document.create-element \mk-select-file-from-drive-window
	browser-controller = riot.observable!
	riot.mount browser, do
		multiple: false
		controller: browser-controller
	browser-controller.trigger \open
	browser-controller.one \selected (file) ~>
		cropper = document.body.append-child document.create-element \mk-crop-window
		cropper-controller = riot.observable!
		riot.mount cropper, do
			file: file
			title: 'バナーとして表示する部分を選択'
			aspect-ratio: 16 / 9
			controller: cropper-controller
		cropper-controller.trigger \open
		cropper-controller.on \cropped (blob) ~>
			data = new FormData!
			data.append \_i I._web
			data.append \file blob, file.name + '.cropped.png'
			api 'drive/folders/find' do
				name: 'バナー'
			.then (banner-folder) ~>
				if banner-folder.length == 0
					api 'drive/folders/create' do
						name: 'バナー'
					.then (banner-folder) ~>
						@uplaod data, banner-folder
				else
					@uplaod data, banner-folder.0
		cropper-controller.on \skiped ~>
			@set file

	@uplaod = (data, folder) ~>

		progress = document.body.append-child document.create-element \mk-progress-dialog
		progress-controller = riot.observable!
		riot.mount progress, do
			title: '新しいバナーをアップロードしています'
			controller: progress-controller

		if folder?
			data.append \folder folder.id

		xhr = new XMLHttpRequest!
		xhr.open \POST CONFIG.api.url + '/drive/files/create' true
		xhr.onload = (e) ~>
			file = JSON.parse e.target.response
			progress-controller.trigger \close
			@set file

		xhr.upload.onprogress = (e) ~>
			if e.length-computable
				progress-controller.trigger \update e.loaded, e.total

		xhr.send data

	@set = (file) ~>
		api 'i/update' do
			banner: file.id
		.then (i) ~>
			dialog do
				'<i class="fa fa-info-circle"></i>バナーを更新しました'
				'新しいバナーが反映されるまで時間がかかる場合があります。'
				[
					text: \わかりました。
				]
			if cb? then cb i
		.catch (err) ~>
			console.error err
			#@opts.ui.trigger \notification 'Error!'
