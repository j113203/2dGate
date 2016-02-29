//	2dgate library
//	code by j113203 { wtapss: +852 91738490 , j113203@gmail.com }
var $2dgate = {
	JSONP : {
		get : function(url , callback , error_callback){
			$.ajaxSetup({
				cache: true
			});
			var JSONP_callback = Math.floor(Math.random() * 1e10);
			$2dgate.JSONP.finished[JSONP_callback] = $.Deferred();
			$.getScript($2dgate.Setup.Proxy+ encodeURIComponent(url) +"&callback=$2dgate.JSONP.finished["+ JSONP_callback + "].resolve").done(function( script, textStatus ) {
				$.when($2dgate.JSONP.finished[JSONP_callback]).done(function(data){
					$2dgate.JSONP.finished[JSONP_callback] = undefined;
					try {
						return callback(data.contents);
					}catch(e){
					};
					return callback(data);	
				});
			}).fail(function( jqxhr, settings, exception ) {
				$.getScript("//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select content from data.headers where url="' + url+'"')+"&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json&callback=$2dgate.JSONP.finished["+ JSONP_callback + "].resolve" ).done(function( script, textStatus ) {
					$.when($2dgate.JSONP.finished[JSONP_callback]).done(function(data){
						$2dgate.JSONP.finished[JSONP_callback] = undefined;
						try {
							return callback(data.query.results.resources.content);
						}catch(e){
						};
						return callback(data);
					});
				}).fail(function( jqxhr, settings, exception ) {
					return error_callback();
				});	
			});		
		},
		finished : {}
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
		tid : function(url,callback){
			$2dgate.JSONP.get("http://2d-gate.org/thread-"+url+"-1-1.html",function(data){
				var rows = [];
				data = $(data);
				var video = {};
				$.each(data.find("td.t_f div ul li"),function( i , v ){
					video[$(v).text()] = data.find("td.t_f div div.gd_thumb:eq("+i+")").attr("onclick").match(/javascript:gdclick_2dg\(.*,'(.*?)',.*/)[1];
				});	
				rows.push({
					"subject" : data.find("a#thread_subject").children().remove().end().text(),
					"extra" : data.find("h1:eq(1)").text(),
					"intro" : data.find("span.intro").text(),
					"staff" : data.find("div.highslide-maincontent").text(),
					"video" : video
				});
				return callback(rows);
			});
		},
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
							"subject" : $row.text(),
							"tid" : $row.attr("href").match(/thread-(.*?)-.*-.*\.html/)[1]
						});	
					});
					return false;
				});
				return callback(rows);
			});
		},
		list : function(callback){
			$2dgate.JSONP.get("http://anime.2d-gate.org/__cache.html",function(data){
				var rows = [];
				$.each($(data.replace(/<(script|img)[^>]+?\/>|<(script|img)(.|\s)*?\/(script|img)>/gi, '')).filter("table#animeList").children("tbody").children(), function(i , n){
					var $row = $(n);
					rows.push({
						"subject" : $row.find('td:eq(6)').html(),
						"year" : $row.find('td:eq(1)').text(),
						"season" : $row.find('td:eq(2)').text(),
						"views" : $row.find('td:eq(3)').text(),
						"dateline" : $row.find('td:eq(4)').text(),
						"lastpost" : $row.find('td:eq(5)').text(),
						"tid" :  $row.find('td:eq(0) a').attr('href').match(/thread-(.*?)-.*-.*\.html/)[1]
					});
				});
				return callback(rows);	
			});
		},
		list_ : function(callback){
			$2dgate.JSONP.get("http://anime.2d-gate.org/?jsonOnly=1",function(data){
				try {
					return callback(data.json.threads);
				}catch(e){
				};
				return callback($.parseJSON(data.split("\n").pop()).threads);
			});
		}
	},
	thumbnail : function( src , width , height ){
		if (width){
			width = "&w=" + width;
		}
		if (height){
			height ="&h=" + height;
		}
		return "http://thumbnail.2d-gate.org/?src=" + src + (width || "") + (height || "");
	}
};