var background = chrome.extension.getBackgroundPage();
var host = background.host;
var userIdentify = background.userIdentify;
document.addEventListener('DOMContentLoaded', function() {

	$("#upload").click(function() {
		//console.log("upload clicked");

		userIdentify = $("#uid").val();
		console.log(userIdentify);

		chrome.tabs.query({}, function(tabs) {
			var saveInfo = {};
			var tabary = [];
			var functionCalls = [];


			 for (var i in tabs) {

				functionCalls = chrome.tabs.sendMessage(tabs[i].id, {
					action : "getScrollPosition"
				}, function(response) {
					console.log(response);
					if(!response)return;
					var obj = {};
					try{
						obj = {title : response.title,
						url : response.url,
						scrollLocation : response.scrollLocation
					};
					}catch(e){
						console.log("fail");
					}
					tabary.push(obj);
				});

			}
			// console.log(tabary.len);

			// $.when.apply(null, functionCalls).done(function() {
			// $(document).ajaxStop(function () {
			setTimeout(function() {
				console.log('len:'+tabary.length);
				saveInfo.urls = tabary;
				saveInfo.userIdentify = userIdentify;
				saveInfo.timestamp = (new Date()).getTime();
				console.log("all tabs ary OK");

				//chrome.storage.loca;
				$.ajax({
					type : 'POST',
					url : host + "/tabs/save/",
					data : JSON.stringify(saveInfo),
					// data : "122gg",
					contentType : "text/plain",
					// contentType: "application/json",
					//dateType:'text',
					success : function(data) {
						console.log("success:[" + data + "]");
					},
					error : function(data) {
						console.log("fail" + JSON.parse(JSON.stringify(tabary)));
					}
				});
				console.log("window will close");
				// window.close();

			},1000);
		});

	});
	$("#openUrls").click(function() {
		$.ajax({
			type: 'GET',
			url: "http://140.123.101.185:3009/tabs/get/?uid="+$("#uid").val(),
			//dataType: 'jsonp',
			success: function(json) {
				chrome.runtime.sendMessage({
					openUrls : json
				});

			
    		}
		});
	});
	chrome.runtime.sendMessage({
		msg : "popup.js running"
	});

});
