# Stream
#================================

ReconnectingWebSocket = require \reconnecting-websocket
riot = require \riot

function init me, iupdate
	state = \initializing
	state-ev = riot.observable!
	event = riot.observable!

	socket = new ReconnectingWebSocket CONFIG.api.url.replace \http \ws

	socket.onopen = ~>
		state := \connected
		state-ev.trigger \connected
		socket.send JSON.stringify do
			i: me.token

	socket.onclose = ~>
		state := \reconnecting
		state-ev.trigger \closed

	socket.onmessage = (message) ~>
		try
			message = JSON.parse message.data
			if message.type?
				event.trigger message.type, message.body
		catch
			# ignore

	get-state = ~> state

	event.on \i_updated iupdate

	{
		state-ev
		get-state
		event
	}

# Export
#--------------------------------

module.exports = init
