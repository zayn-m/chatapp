import React from 'react';

import './Input.css';

export default ({ message, setMessage, sendMessage }) => (
	<form className="form">
		<input
			className="input"
			type="text"
			placeholder="Write a message..."
			value={message}
			onChange={(e) => setMessage(e.target.value)}
			onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
		/>
		<button type="submit" className="sendButton" onClick={(e) => sendMessage(e)}>
			Send
		</button>
	</form>
);
