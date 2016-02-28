var $2dgate = {
	FanHuaJi : function(text , to , callback){
		$.getJSON(YQL("https://sctctw.2d-gate.org/api.php?text="+text+"&to="+to,"//body"),function(data){
			callback($.parseJSON(data.query.results.body));
		});
	},
	Anime : {
		listType : {"星期一" : 0 ,	"星期二" : 1 ,	"星期三" : 2 ,	"星期四" : 3 ,	"星期五" : 4 ,	"星期六" : 5 ,	"星期日" : 6 ,	"不定期" : 7 ,	"劇場" : 8 , 	"@OVA" : 9 ,	"填坑" : 10 ,	"舊番區" : 11 ,	"大長篇" : 12},
		list : function(type , callback){
			var listType = this.listType[type];
			if (typeof listType !== 'undefined') {
				$.getJSON(YQL("http://2d-gate.org/forum-78-1.html","//table[@id='olAL']/tbody/tr["+listType+1+"]"),function(data){
					callback(data.query.results.tr);
				});
			}
		},
		full : function(callback){
			$.get(YQL_robot("http://anime.2d-gate.org/__cache.html"),function(data){
				var rows = [];
				$.each($(data.query.results.resources.content).filter("table#animeList").children("tbody").children(), function(i , n){
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
var YQL = function(url , xpath){
	xpath = xpath || "*" ;
	return "//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select * from html where url="' + url + '" and xpath="'+ xpath +'"')+"&format=json";
}
var YQL_robot = function(url){
	return "//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select content from data.headers where url="' + url+'"')+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
}







