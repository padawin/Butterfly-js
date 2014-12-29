(function(){
	var B={},
		setAttribute='setAttribute',
		getAttribute='getAttribute',
		appendChild = 'appendChild',
		cattr, $id, ex, _getScripts;

	ex = function(v){return v!=null && v!=undefined;};
	B.exists = ex;

	$id = function(id){
		if(typeof id=="string" && id!='')
			return document.getElementById(id);
		else if(id==='' || !ex(id))
			return null;
		else
			return id;
	};
	B.$id = $id;
	B.$sel=function(selector) {
		return document.querySelectorAll(selector);
	};

	cattr=document.all?'className':'class';
	function classRegex(c){return new RegExp('(?:\\s|^)'+c+'(?:\\s|$)');}

	B.hasClass=function(i,c){
		i=$id(i);
		if(!ex(i) || !i[getAttribute](cattr))
			return false;
		return i[getAttribute](cattr).match(classRegex(c));
	};
	B.addClass=function(i,c){
		i=$id(i);
		if(!B.hasClass(i,c)){
			var cn=i[getAttribute](cattr)||'';
			i[setAttribute](cattr,cn+' '+c);
		}
	};
	B.removeClass=function(i,c){
		i=$id(i);
		if(ex(i) && B.hasClass(i,c)){
			var cn=i[getAttribute](cattr).replace(classRegex(c),' ');
			i[setAttribute](cattr,cn);
		}
	};
	B.replaceClass=function(i,cO,cN,app){
		i=$id(i);
		if(ex(i)){
			var cn=i[getAttribute](cattr);
			if(B.hasClass(i,cO)) {
				cn=cn.replace(classRegex(cO),' '+cN+' ');
				i[setAttribute](cattr,cn);
			}else if(app)
				B.addClass(i, cN);
		}
	};
	B.setClass = function(i,c){
		i=$id(i);
		ex(i) && i[setAttribute](cattr,c);
	};

	B.create=function(n,att,p){
		var e, k;
		if(n=='text')
			e=document.createTextNode(att['value']);
		else{
			e=document.createElement(n);
			for(k in att){
				switch(k){
				default:
					e[setAttribute](k, att[k]);
					break;
				case 'id':
					if($id(att[k])==null || $id(att[k])==undefined)
						e[setAttribute]('id',att[k]);
					break;
				case 'style':
				case 'cssText':
					// doesn't seem to work with IE
					e[setAttribute]('cssText',att[k]);
					e[setAttribute]('style',att[k]);
					break;
				case 'class':
				case 'className':
					B.setClass(e,att[k]);
					break;
				case 'text':
					e[appendChild](document.createTextNode(att[k]));
					break;
				}
			}
		}
		//if the parent is given, the created node will be put in it
		if(ex($id(p)) || p && ex($id(p.element))){
			if(!ex(p.element)) $id(p)[appendChild](e);
			else{
				//if the elem has to be inserted before an element
				if(ex($id(p.before))) $id(p.element).insertBefore(e,$id(p.before));
				//else if it has to be inserted after an element
				else if(ex($id(p.after)) && ex($id(p.after).nextSibling)) $id(p.element).insertBefore(e,$id(p.after).nextSibling);
				//else append
				else $id(p.element)[appendChild](e);
			}
		}
		return e;
	};

	B.addEvent=B.on=function(item,event,action,opt,args){
		opt=opt||{};
		args=args||new Array();
		item=$id(item);
		item[event+action]=function(evt){
			var scope=$id('scope' in opt?opt['scope']:window);
			if(!opt['skipEvent']) action.apply(scope,args.concat([evt]));
			else action.apply(scope,args);
		};

		if(item.attachEvent) item.attachEvent('on'+event,item[event+action]);
		else if(item.addEventListener) item.addEventListener(event,item[event+action],opt['propagate'] == true);
	};

	B.removeEvent=function(item,event,action,opt,args){
		opt=opt||{};
		args=args||new Array();
		item=$id(item);
		if(item.detachEvent) item.detachEvent('on'+event,item[event+action]);
		else if(item.removeEventListener) item.removeEventListener(event,item[event+action],opt['propagate'] == true);
		delete item[event+action];
	};

	B.appendChildren=function(i,c){
		var lC=c.length, k;
		i=$id(i);
		for(k=0;k<lC;k++)
			i[appendChild](c[k]);
	};

	B.getStyle=function(i,s){
		i=$id(i);
		if (!ex(i)) return;
		var y;
		if(i.currentStyle){
			s=s.replace(/\-(\w)/g,function(m,p1){return p1.toUpperCase();});
			y=i.currentStyle[s];
		}else if(window.getComputedStyle){
			s=s.replace(/([A-Z])/g,function(p1){return "-"+p1.toLowerCase();});
			y=document.defaultView.getComputedStyle(i,null).getPropertyValue(s);
		}
		return y;
	};

	B.getStyleValue=function(i,s){
		var v=B.getStyle(i, s);
		return parseFloat(v);
	};

	/* AJAX */
	B.Ajax = {};

	/**
	 *
	 * extract all js code in <scripts> tags and return an array
	 * containing the codes
	 *
	 * str is [html part][script part][html part][script part]...
	 *
	 * [script part]s go in scripts var
	 *
	 */
	_getScripts=function(s){
		var scriptBeginRegexp = /<script[\stype="'x\/javascri]*>/gi,
			scriptEndRegexp = /<\/[\s]*script>/gi,
			posStart, valueStart, posEnd, valueEnd, pos1, pos2, val2,
			scripts=[];

		while (s) {
			//return the position of the first script open tag (<script>)
			posStart=s.search(scriptBeginRegexp);
			valueStart=s.match(scriptBeginRegexp);
			//if a script is found, set pos1 at the script position
			pos1=(~posStart?posStart:s.length-1);
			if(!~posStart){
				//stop the loop
				pos2=s.length-1;
				val2=0;
			}else{
				posEnd=s.search(scriptEndRegexp);
				valueEnd=s.match(scriptEndRegexp);
				//if a script is found, set pos2 at the script position
				pos2=(~posEnd?posEnd:s.length-1);
				scripts.push(s.substring(pos1+valueStart[0].length,pos2));
				val2=valueEnd[0].length;
			}
			s=s.substring(pos2+val2,s.length-1);
		}
		return scripts;
	}

	/**
	 * Method to execute AJAX requests.
	 *
	 * behaviors: functions for what to do on each status and readyState.
	 * 		Associative array, with as keys the status and readyState values.
	 * 		For example, to execute a function when the status is 200,
	 * 		behaviorsStatus must be {200: function(xhr){//do things here}}
	 * options: associative array. For the moment, there is only one possible
	 * 		value :
	 * 		- async: if true, the request will be executed in asynchronous mode.
	 *
	 */
	B.Ajax.request=function(url,behaviorsStatus,behaviorsReadyState,method,params,options){
		behaviorsStatus = behaviorsStatus || {};
		behaviorsReadyState = behaviorsReadyState || {};
		options = options || {};

		var xhr;
		if(window.XMLHttpRequest) xhr = new XMLHttpRequest();
		else if(window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

		if(xhr){
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4)
					behaviorsStatus[xhr.status] && (behaviorsStatus[xhr.status])(xhr);
				else
					behaviorsReadyState[xhr.readyState] && (behaviorsReadyState[xhr.readyState])(xhr);
			};

			xhr.open(method=='POST'?method:'GET',url,B.exists(options.async)?options.async:true);

			if(method=='POST'){
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				xhr.setRequestHeader("Content-length",params.length);
				xhr.setRequestHeader("Connection","close");
			}

			xhr.send(method=='POST'?params:null);

			return xhr;
		}
	};

	/**
	 * Shortcut method of request to update a node with the request response.
	 */
	B.Ajax.update=function(nodeToUpdate,url,evalScripts,method,params,options){
		var updateFunc=function(xhr){
			B.$id(nodeToUpdate).innerHTML=xhr.responseText;
				if(evalScripts){
				var i,
					scripts=getScripts(xhr.responseText);
				for(i in scripts) window.eval(scripts[i]);
			}
		};

		B.Ajax.request(url,{200:updateFunc},{},method,params,options);
	};

	// Finally, set B visible to everybody
	window['B']=B;

	/******** MISC NON-BUTTERFLY FEATURES **********/

	function indexOf(v){
		for(var k in this)
			if(this[k]==v) return k;
		return -1;
	}

	Object.prototype.indexOf || (Object.prototype.indexOf = indexOf);
	Array.prototype.indexOf || (Array.prototype.indexOf = indexOf);

	function bind(obj){
		var s=Array.prototype.slice,
			args=s.call(arguments, 1),
			self=this,
			n=function(){},
			bound=function(){
			return self.apply(
				this instanceof n ? this : ( obj || {} ),
				args.concat(s.call(arguments))
			);
		};
		n.prototype=self.prototype;
		bound.prototype=new n();
		return bound;
	}
	Function.prototype.bind || (Function.prototype.bind = bind);

})();
