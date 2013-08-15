(function(){
	var B={};

	var setAttribute='setAttribute';
	var getAttribute='getAttribute';

	var ex=function(v){return v!=null && v!=undefined;};
	B.exists=ex;

	var $id=function(id){
		if(typeof id=="string" && id!='')
			return document.getElementById(id);
		else if(id==='' || !ex(id))
			return null;
		else
			return id;
	};
	B.$id=$id;

	var cattr=document.all?'className':'class';
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
		var e;
		var appendChild = 'appendChild';
		if(n=='text')
			e=document.createTextNode(att['value']);
		else{
			e=document.createElement(n);
			for(var k in att){
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
				if(ex($id(p.before))) $id(p.element).insertBefore(e, $id(p.before));
				//else if it has to be inserted after an element
				else if(ex($id(p.after)) && ex($id(p.after).nextSibling)) $id(p.element).insertBefore($id(p.after).nextSibling);
				//else append
				else $id(p.element)[appendChild](e);
			}
		}
		return e;
	};

	B.addEvent=function(item,event,action,opt,args){
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
		var lC=c.length;
		i=$id(i);
		for(var k=0;k<lC;k++)
			i[appendChild](c[i]);
	};

	B.getStyle=function(i,s){
		i=$id(i);
		if (!ex(i)) return;
		if(i.currentStyle){
			s=s.replace(/\-(\w)/g,function(m,p1){return p1.toUpperCase();});
			var y=i.currentStyle[s];
		}else if(window.getComputedStyle){
			s=s.replace(/([A-Z])/g,function(p1){return "-"+p1.toLowerCase();});
			var y=document.defaultView.getComputedStyle(i,null).getPropertyValue(s);
		}
		return y;
	};

	B.getStyleValue=function(i,s){
		var v=B.getStyle(i, s);
		return parseFloat(v);
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
		var s=Array.prototype.slice;
		args=s.call(arguments, 1);
		var self=this;
		var n=function(){};
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
