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

			sendGetScrollPosition(tabs,tabary);
			
			 // for (var i in tabs) {
// 
				// functionCalls = chrome.tabs.sendMessage(tabs[i].id, {
					// action : "getScrollPosition"
				// }, function(response) {
					// console.log(response);
					// if(!response)return;
					// var obj = {};
					// try{
						// obj = {title : response.title,
						// url : response.url,
						// scrollLocation : response.scrollLocation
					// };
					// }catch(e){
						// console.log("fail");
					// }
					// tabary.push(obj);
				// });
// 
			// }
			// console.log(tabary.len);

			// $.when.apply(null, functionCalls).done(function() {
			// $(document).ajaxStop(function () {
			setTimeout(function() {
				console.log(tabary);
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
	$("#getsource").click(function() {
		chrome.runtime.sendMessage({
					action : "getSource"
				});

	});
	$("#search").click(function() {
		// chrome.runtime.sendMessage({
					// action : "search",
					// search : $("#uid").val()
				// });
		var contentSave={};
		chrome.storage.local.get(null, function(items) {
			contentSave = items.content;
			//console.log(items);return;
			var results = {};
			pattern = $("#uid").val();
			var locate = -1;
			
			//var results = [];
			//for (var i = 0; i < contentSave.length; i++) {
			for (var i in items) {
				locate = items[i].content.indexOf(pattern);
				if (locate != -1 && !results.hasOwnProperty(items[i].url)) {
					var url = items[i].url;
					var content = items[i].content;
					var title = items[i].title;
					// results.push({ url:url });
					var obj={};
					obj = {url:url,title:title,subcontent:content.substring(locate-10,locate+10)};
					
					results[url] = obj;
					console.log(locate + "$$$$" + results.hasOwnProperty(items[i].url) + "&&&" + items[i].url);
				} else {
					console.log(locate + "$$$$" + results.hasOwnProperty(items[i].url) + "&&&" + items[i].url);
				}
			}
			// for(var i =0;i<results.length;i++){
			// console.log(results[i].url);
			// }

			console.log("result" + JSON.stringify(results));
				
			htmStr = "";
			$("#tabList").html(""); 
			for (var i in results) {
				if (results[i].title && results[i].title != "") {

					var tabList = document.getElementById("tabList");
					var list = document.createElement('div');
					list.setAttribute("class","list");
					var href = document.createElement("a");
					href.setAttribute("href",results[i].url);
					href.innerHTML=results[i].title;
					list.appendChild(href);
					list.appendChild(document.createElement("br"));
					var subcontent = document.createElement('div');
					subcontent.setAttribute("class","subcontent");
					subcontent.appendChild(document.createTextNode(results[i].subcontent) );
					list.appendChild(subcontent);
					tabList.appendChild(list);

					//htmStr += '<div class="list"><a href="' + results[i].url + '">' + results[i].title + '</a><br/>';
					//htmStr += '<div class="subcontent">' + results[i].subcontent + '</div></div>';

				}
			}
			//$("#tabList").html(htmStr); 
			console.log($("tabList"));

		}); 


	});
	chrome.runtime.sendMessage({
		msg : "popup.js running"
	});

});

function sendGetScrollPosition(tabs, tabary) {
	
	for (var i in tabs) {

		functionCalls = chrome.tabs.sendMessage(tabs[i].id, {
			action : "getScrollPosition"
		}, function(response) {
			console.log(response);
			if (!response)
				return;
			var obj = {};
			try {
				obj = {
					title : response.title,
					url : response.url,
					scrollLocation : response.scrollLocation
				};
				console.log("success in sendGetScrollPosition ");
			} catch(e) {
				console.log("fail");
			}
			
			tabary.push(obj);
		});

	}
}
