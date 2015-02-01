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


			 for (var i in tabs) {

				chrome.tabs.sendMessage(tabs[i].id, {
					action : "getScrollPosition"
				}, function(response) {
					
					tabary.push({
						title : response.title,
						url : response.url,
						scrollLocation : response.scrollLocation
					});
				});

			}
			console.log(tabary);

			$.when.apply(null, tabs).done(function() {

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
				//console.log("window will close");
				window.close();

			});
		});

	});
	chrome.runtime.sendMessage({
		action : "iconClick"
	});

});
