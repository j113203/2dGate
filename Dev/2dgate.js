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
						a = data;
						return callback(data.contents || data.data || data[Object.keys(data)[0]] || data);
				});
			}).fail(function( jqxhr, settings, exception ) {
				$.getScript("//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select content from data.headers where url="' + url+'"')+"&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json&callback=$2dgate.JSONP.finished["+ JSONP_callback + "].resolve" ).done(function( script, textStatus ) {
					$.when($2dgate.JSONP.finished[JSONP_callback]).done(function(data){
						$2dgate.JSONP.finished[JSONP_callback] = undefined;
						return callback(data.query.results.resources.content || data);
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
		//Proxy : "http://user.frdm.info/ckhung/i/ba-simple-proxy.php?url="
		//Proxy : "https://jsonp.afeld.me/?url="
		Proxy : "http://benalman.com/code/projects/php-simple-proxy/ba-simple-proxy.php?url="
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
				data = $($.parseHTML(data,null,false));
				a = data;
				var video = {};
				$.each(data.find("td.t_f ul a"),function( i , v ){
					v = $(v);
					var video_url = v.attr("href");
					video_url = video_url.substring(video_url.lastIndexOf("#"));
					var video_info = [];
					video_url = (data.find("td.t_f div"+video_url+" div.gd_thumb").attr("onclick") || "" );
					if (video_url){
						video_url = video_url.match(/javascript:gdclick_2dg\(.*,'(.*?)',.*/)[1];
					}
					video_info.push({
						"subject" : v.text(),
						"id" : video_url
					});
					video[i] = video_info ;
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
				$.each($($.parseHTML(data,null,false)).find("table#olAL tbody").children(), function(i , n){
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
				$.each($($.parseHTML(data,null,false)).filter("table#animeList").children("tbody").children(), function(i , n){
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
				return callback(data.json.threads || $.parseJSON(data.split("\n").pop()).threads);
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