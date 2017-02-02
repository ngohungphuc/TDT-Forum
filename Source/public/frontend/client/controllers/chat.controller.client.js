(function() {
	'use strict';

	angular.module('ChatBotApp')
		.controller('ChatController', ChatController);

	ChatController.$inject = ['$scope', 'localStorageService', '$document'];

	function ChatController($scope, localStorageService, $document) {
		var socket = io.connect();
		var loginUser = localStorageService.cookie.get('currentUser');
		var facebookUser = localStorageService.cookie.get('facebookUser');
		var currentUser = loginUser ? loginUser : facebookUser;
		socket.emit('new user', currentUser);
		var chat = $('.media-list');
		var onlineList = $('.list-online');
		var currentTime = new Date().toLocaleString();
		$scope.SendMessage = function() {
			if(!currentUser) {
				toastr.warning("Vui lòng đăng nhập để tham gia phòng chat");
				return false;
			}
			var message = $("#chatMessageSend").val();
			if($.trim($("#chatMessageSend").val()) === '') {
				toastr.warning("Vui lòng nhập tin nhắn");
				return false;
			}
			var messageInfo = {
				username: currentUser,
				message: message
			};
			socket.emit('send message', messageInfo);
			$("#chatMessageSend").val('');
		};

		socket.on('new message', function(data) {
			chat.append('<p><div class="media-body" id="chat-element">' + data.message + '<br><small class="text-muted">' + data.username + ' | ' + currentTime + '</small></div></p>');
			var myDiv = document.getElementById('chat-element');
			myDiv.scrollTop = myDiv.scrollHeight;
		});
		socket.on('get users', function(data) {
			var listUserOnline = '';
			for(var i = 0; i < data.length; i++) {
				listUserOnline += '<p>' + data[i] + '</p>';
			}
			onlineList.html(listUserOnline);
		});
	}
})();