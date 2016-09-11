module.exports = function(tokens) {
	return tokens.map(function(token) {
		var type = token.type;
		var content = token.content;
		switch (type) {
			case 'text':
				return content
					.replace(/>/g, '&gt;')
					.replace(/</g, '&lt;')
					.replace(/(\r\n|\n|\r)/g, '<br>');
			case 'link':
				return '<a href="' + content + '" target="_blank">' + content + '</a>';
			case 'mention':
				return '<a href="https://misskey.xyz/' + content + '" target="_blank">@' + content + '</a>';
		}
	}).join('');
}