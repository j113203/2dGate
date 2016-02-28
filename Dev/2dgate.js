var $2dgate = {
	FanHuaJi : function(text , to , callback){
		$.get("https://sctctw.2d-gate.org/api.php?text="+text+"&to="+to,function(data){
			callback($.parseJSON(data.query.results.html.body));
		});
	},
	Anime : {
		listType : {"星期一" : 0 ,	"星期二" : 1 ,	"星期三" : 2 ,	"星期四" : 3 ,	"星期五" : 4 ,	"星期六" : 5 ,	"星期日" : 6 ,	"不定期" : 7 ,	"劇場" : 8 , 	"@OVA" : 9 ,	"填坑" : 10 ,	"舊番區" : 11 ,	"大長篇" : 12},
		list : function(type , callback){
			var listType = this.listType[type];
			if (typeof listType !== 'undefined') {
				$.get("http://2d-gate.org/forum-78-1.html",function(data){
					callback(data.query.results.html.body.div[4].div.div.div.div.div[3].div.div.div[0].div[1].div[1].div.table.tbody.tr[listType].td.div);
				});
			}
		},
	}
};









jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = '//query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'json'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {                    
                    if (_success) {
                        _success.call(this,data, 'success');
                    }              
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);