//	2dgate library
//	code by j113203 { wtapss: +852 91738490 , j113203@gmail.com }
var $2dgate = {
	JSONP : {
		get : function(url , callback){
			$.ajaxSetup({
				cache: true
			});
			$.getScript($2dgate.get(url)+"&callback=$2dgate.JSONP.finish",function(){
				$.when($2dgate.JSONP.finished).done(function(data){
					callback(data);
				});
			});
		},
		finish : function(data){
			if($2dgate.Setup.Proxy){
				this.finished.resolve(data.contents);
			}else{
				this.finished.resolve(data.query.results.resources.content);
			}
		},
		finished : $.Deferred()
	},
	get : function(url){
		if(this.Setup.Proxy){
			return this.Setup.Proxy + encodeURIComponent(url);
		}else{
			return "//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select content from data.headers where url="' + url+'"')+"&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";	
		}
	},
	Setup : {
		//Proxy : ""
		Proxy : "http://user.frdm.info/ckhung/i/ba-simple-proxy.php?url="
	},
	FanHuaJi : function(text , to , callback){
		$2dgate.JSONP.get("https://sctctw.2d-gate.org/api.php?text="+text+"&to="+to,function(data){
			if (typeof data === 'string') {
				callback($.parseJSON(data));
			}else{
				callback(data);		
			}
		});
	},
	Anime : {
		weeks : function(name , callback){
			$2dgate.JSONP.get("http://2d-gate.org/forum-78-1.html",function(data){
				var rows = [];
				$.each($(data.replace(/<(script|img)[^>]+?\/>|<(script|img)(.|\s)*?\/(script|img)>/gi, '')).find("table#olAL tbody").children(), function(i , n){
					if ($(n).find("th:eq(0)").text() != name){
						return true;
					};
					$.each($(n).find("td:eq(0)").children(), function(i , n){
						var $row = $(n);
						rows.push({
							"標題" : $row.text(),
							"連結" : $row.attr("href")
						});	
					});
					return false;
				});
				callback(rows);
			});
		},
		list : function(callback){
			$2dgate.JSONP.get("http://anime.2d-gate.org/__cache.html",function(data){
				var rows = [];
				$.each($(data.replace(/<(script|img)[^>]+?\/>|<(script|img)(.|\s)*?\/(script|img)>/gi, '')).filter("table#animeList").children("tbody").children(), function(i , n){
					var $row = $(n);
					rows.push({
						"標題" : $row.find('td:eq(6)').html(),
						"年份" : $row.find('td:eq(1)').text(),
						"季節" : $row.find('td:eq(2)').text(),
						"瀏覽數" : $row.find('td:eq(3)').text(),
						"發表於" : $row.find('td:eq(4)').text(),
						"更新於" : $row.find('td:eq(5)').text(),
						"連結" :  $row.find('td:eq(0) a').attr('href')
					});
				});
				return callback(rows);	
			});
		}
	}
};