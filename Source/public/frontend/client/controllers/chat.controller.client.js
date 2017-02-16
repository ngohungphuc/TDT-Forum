(function() {
	'use strict';

	angular.module('ChatBotApp')
		.controller('ChatController', ChatController);

	ChatController.$inject = ['$scope', '$location', 'localStorageService', '$document', 'GetMessageService', 'SaveMessageService'];

	function ChatController($scope, $location, localStorageService, $document, GetMessageService, SaveMessageService) {
		var loginUser = localStorageService.cookie.get('currentUser');
		var facebookUser = localStorageService.cookie.get('facebookUser');
		var currentUser = loginUser ? loginUser : facebookUser;
		if(currentUser === null) {
			$location.path('/dang-nhap');
		}
		GetMessageService.GetMessage().then(function(response) {
			console.log(response.data.result);
			$scope.messageData = response.data.result;
		});
		var socket = io.connect();
		var currentTime = new Date().toLocaleString();
		socket.emit('new user', currentUser);
		var chat = $('.media-list');
		var onlineList = $('.list-online');


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
				message: message,
				currentTime: currentTime
			};
			socket.emit('send message', messageInfo);
			SaveMessageService.SaveMessage(messageInfo).then(function(result) {
				console.log(result);
				$("#chatMessageSend").val('');
			});
		};

		socket.on('new message', function(data) {
			chat.append('<li class="media-body">' + data.message + '<br><small class="text-muted">' + data.username + ' | ' + currentTime + '</small></li>');
			/*var myDiv = document.getElementById('chat-element');
			myDiv.scrollTop = myDiv.scrollHeight;*/
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
