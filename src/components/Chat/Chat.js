import React from 'react';
import { withRouter } from 'react-router-dom';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';
let INTERVAL_ID;

const Chat = ({ token, setToken }) => {
	const [ name, setName ] = React.useState('');
	const [ message, setMessage ] = React.useState('');
	const [ messages, setMessages ] = React.useState([]);
	const [ lastEl, setLastEl ] = React.useState({});

	React.useEffect(() => {
		if (localStorage.getItem('username')) {
			setName(localStorage.getItem('username'));
		}

		window.addEventListener('scroll', listenToScroll, true);

		fetchData();

		INTERVAL_ID = setInterval(() => {
			fetchData();
		}, 3000);

		return () => {
			window.removeEventListener('scroll', listenToScroll);
			clearInterval(INTERVAL_ID);
		};
	}, []);

	const fetchData = () => {
		fetch(`${API_ENDPOINT}/chats?createdAtFrom=${lastEl.createdAt || ''}`)
			.then((res) => res.json())
			.then((msgs) => {
				const updatedMsgs = messages.concat(msgs);

				setLastEl(msgs[msgs.length - 1]);
				setMessages(updatedMsgs);
			});
	};

	const listenToScroll = (e) => {
		const div = document.getElementById('messagesContainer');
		// console.log(window.scrollY);
		// const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

		// const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

		// const scrolled = winScroll / height;
	};

	const onLogin = (e) => {
		e.preventDefault();

		fetch(`${API_ENDPOINT}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `name=${name}`
		})
			.then((response) => response.json())
			.then(({ key }) => {
				if (key) {
					setToken(true);
					localStorage.setItem('__key', key);
					localStorage.setItem('username', name);
				}
			})
			.catch((err) => console.error(err));
	};

	const sendMessage = (e) => {
		e.preventDefault();

		if (message) {
			fetch(`${API_ENDPOINT}/chats`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Key ${localStorage.getItem('__key')}`
				},
				body: `message=${message}`
			})
				.then((response) => response.json())
				.then((res) => {
					const obj = {
						createdAt: res.createdAt,
						message: res.message,
						userName: res.user.name,
						_id: res.user._id
					};
					setMessages([ ...messages, obj ]);
				})
				.catch((err) => console.error(err));

			setMessage('');
		}
	};

	const logout = () => {
		localStorage.removeItem('__key');
		localStorage.removeItem('username');
		setToken(false);
	};

	const loadMessages = () => {
		fetchData();
		clearInterval(INTERVAL_ID);
	};

	return (
		<div className="outerContainer">
			<div className="innerContainer">
				<InfoBar
					name={name}
					token={token}
					handleInput={(e) => setName(e.target.value)}
					handleLogin={onLogin}
					handleLogout={logout}
				/>
				<Messages messages={messages} name={name} lastEl={lastEl} loadMore={loadMessages} />
				{token && <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />}
			</div>
		</div>
	);
};

export default withRouter(Chat);
