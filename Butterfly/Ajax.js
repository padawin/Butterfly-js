/**
 *
 * Class to do ajax requests with Butterfly
 *
 */


Butterfly.Ajax = {

    /**
     *
     * behaviors : functions for what to do on each status ans readyState
     *
     */
    request: function(url, behaviorsStatus, behaviorsReadyState, method, params, options)
    {

        if (behaviorsStatus == null) {
            behaviorsStatus = {};
        }

        if (behaviorsReadyState == null) {
            behaviorsReadyState = {};
        }

        if (options == null) {
            options = {};
        }

        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xhr) {
            xhr.onreadystatechange = function()
            {
                if(xhr.readyState  == 4) {
                    if(behaviorsStatus[xhr.status]) {
                        var func = behaviorsStatus[xhr.status];
                        func(xhr);
                    }
                }
                else {
                    if (behaviorsReadyState[xhr.readyState]) {
                        var func = behaviorsReadyState[xhr.readyState];
                        func(xhr);
                    }
                }
            };

            xhr.open( method == 'POST' ? method : 'GET', url,  (Butterfly.exists(options.async) ? options.async : true));

            if (method == 'POST') {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Content-length", params.length);
                xhr.setRequestHeader("Connection", "close");
            }

            xhr.send( method == 'POST' ? params : null );

            return xhr;
        }
    },

    update: function(nodeToUpdate, url, evalScripts, method, params, options)
    {
        Butterfly.Ajax.request(url, {200: function(xhr)
        {
            $id(nodeToUpdate).innerHTML = xhr.responseText;

            setTimeout(
                function()
                {
                    if (evalScripts) {
                        var scripts = Butterfly.Ajax._getScriptsFromString(xhr.responseText);
                        var nbScripts = scripts.length;
                        for (var i = 0 ; i < nbScripts ; i ++) {
                            window.eval(scripts[i]);
                        }
                    }
                },
                700
            );
        }}, {}, method, params, options);
    },

    /**
     *
     * extract all js code in <scripts> tags and return an array
     * containing the codes
     *
     * For now, htmls is useless... maybe for another use ?
     * str is [html part][script part][html part][script part]...
     *
     * [html part]s go in htmls var
     * [script part]s go in scripts var
     *
     */
    _getScriptsFromString: function(str)
    {
        var scriptBeginRegexp = /<script[\stype="'x\/javascri]*>/gi;
        var scriptEndRegexp = /<\/[\s]*script>/gi;

        var posFirst, valueFirst;
        var posSecond, valueSecond;
        var pos1, pos2, val2;
        var htmls = [];
        var scripts = [];

        while (str != '') {
            //return the position of the first script open tag (<script>)
            posFirst = str.search(scriptBeginRegexp);
            valueFirst = str.match(scriptBeginRegexp);

            //if a script is found
            if (posFirst != -1) {
                pos1 = posFirst;
            }
            else {
                pos1 = str.length - 1;
            }

            //put the current html part
            htmls.push(str.substring(0, pos1));

            if (posFirst != -1) {
                posSecond = str.search(scriptEndRegexp);
                valueSecond = str.match(scriptEndRegexp);

                if (posSecond != -1) {
                    pos2 = posSecond;
                }
                else {
                    pos2 = str.length - 1;
                }
                scripts.push(str.substring(pos1 + valueFirst[0].length, pos2));
                val2 = valueSecond[0].length;
            }
            else {
                //stop the loop
                pos2 = str.length - 1;
                val2 = 0;
            }

            str = str.substr(pos2 + val2, str.length - 1);
        }

        return scripts;
    }

};
