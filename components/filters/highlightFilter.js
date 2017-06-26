define(['./mod'], function (mod) {
    'use strict';
    mod // ----------------------
    //搜索高亮
    .filter('highlightFilter',['$sce','$log',function($sce,$log){
        var fn = function(text, search){
            $log.info("text: " + text);
            $log.info("search: " + search);

            if (!search) {
                return $sce.trustAsHtml(text);
            }
            text = encodeURI(text);
            search = encodeURI(search);

            var regex = new RegExp(search, 'gi')
            var result = text.replace(regex, '<span class="highlightedText">$&</span>');
            result = decodeURI(result);
            $log.info("result: " + result );
            return $sce.trustAsHtml(result);
        };

        return fn;
    }])
    
});
