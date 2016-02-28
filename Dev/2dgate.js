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
		}
	},
};
var YQL = function(url , xpath){
	xpath = xpath || "*" ;
	return "//query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent('select * from html where url="' + url + '" and xpath="'+ xpath +'"')+"&format=json&callback=";
}







