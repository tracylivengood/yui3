YUI.add("event-custom",function(G){G.Env.evt={handles:{},plugins:{}};(function(){var H=0,I=1;G.Do={objs:{},before:function(K,M,N,O){var L=K,J;if(O){J=[K,O].concat(G.Array(arguments,4,true));L=G.rbind.apply(G,J);}return this._inject(H,L,M,N);},after:function(K,M,N,O){var L=K,J;if(O){J=[K,O].concat(G.Array(arguments,4,true));L=G.rbind.apply(G,J);}return this._inject(I,L,M,N);},_inject:function(J,L,M,O){var P=G.stamp(M),N,K;if(!this.objs[P]){this.objs[P]={};}N=this.objs[P];if(!N[O]){N[O]=new G.Do.Method(M,O);M[O]=function(){return N[O].exec.apply(N[O],arguments);};}K=P+G.stamp(L)+O;N[O].register(K,L,J);return new G.EventHandle(N[O],K);},detach:function(J){if(J.detach){J.detach();}},_unload:function(K,J){}};G.Do.Method=function(J,K){this.obj=J;this.methodName=K;this.method=J[K];this.before={};this.after={};};G.Do.Method.prototype.register=function(K,L,J){if(J){this.after[K]=L;}else{this.before[K]=L;}};G.Do.Method.prototype._delete=function(J){delete this.before[J];delete this.after[J];};G.Do.Method.prototype.exec=function(){var L=G.Array(arguments,0,true),M,K,P,N=this.before,J=this.after,O=false;for(M in N){if(N.hasOwnProperty(M)){K=N[M].apply(this.obj,L);if(K){switch(K.constructor){case G.Do.Halt:return K.retVal;case G.Do.AlterArgs:L=K.newArgs;break;case G.Do.Prevent:O=true;break;default:}}}}if(!O){K=this.method.apply(this.obj,L);}for(M in J){if(J.hasOwnProperty(M)){P=J[M].apply(this.obj,L);if(P&&P.constructor==G.Do.Halt){return P.retVal;}else{if(P&&P.constructor==G.Do.AlterReturn){K=P.newRetVal;}}}}return K;};G.Do.AlterArgs=function(K,J){this.msg=K;this.newArgs=J;};G.Do.AlterReturn=function(K,J){this.msg=K;this.newRetVal=J;};G.Do.Halt=function(K,J){this.msg=K;this.retVal=J;};G.Do.Prevent=function(J){this.msg=J;};G.Do.Error=G.Do.Halt;})();(function(){G.EventFacade=function(I,H){I=I||{};this.details=I.details;this.type=I.type;this.target=I.target;this.currentTarget=H;this.relatedTarget=I.relatedTarget;this.stopPropagation=function(){I.stopPropagation();};this.stopImmediatePropagation=function(){I.stopImmediatePropagation();};this.preventDefault=function(){I.preventDefault();};this.halt=function(J){I.halt(J);};};})();var F="after",C=["broadcast","bubbles","context","configured","currentTarget","defaultFn","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],A=new G.EventFacade(),D=G.Object.keys(A),E=9,B="yui:log";G.EventHandle=function(H,I){this.evt=H;this.sub=I;};G.EventHandle.prototype={detach:function(){if(this.evt){this.evt._delete(this.sub);}}};G.CustomEvent=function(H,I){I=I||{};this.id=G.stamp(this);this.type=H;this.context=G;this.logSystem=(H==B);this.silent=this.logSystem;this.subscribers={};this.afters={};this.preventable=true;this.bubbles=true;this.signature=E;this.applyConfig(I,true);};G.CustomEvent.prototype={_YUI_EVENT:true,applyConfig:function(I,H){if(I){G.mix(this,I,H,C);}},_on:function(L,J,I,H){if(!L){G.error("Invalid callback for CE: "+this.type);}var K=new G.Subscriber(L,J,I,H);if(this.fireOnce&&this.fired){G.later(0,this,this._notify,K);}if(H==F){this.afters[K.id]=K;this.hasAfters=true;}else{this.subscribers[K.id]=K;this.hasSubscribers=true;}return new G.EventHandle(this,K);},subscribe:function(I,H){return this._on(I,H,arguments,true);},on:function(I,H){return this._on(I,H,arguments,true);},after:function(I,H){return this._on(I,H,arguments,F);},detach:function(L,J){if(L&&L.detach){return L.detach();}if(!L){return this.unsubscribeAll();}var M=false,I=this.subscribers,H,K;for(H in I){if(I.hasOwnProperty(H)){K=I[H];if(K&&K.contains(L,J)){this._delete(K);M=true;}}}return M;},unsubscribe:function(){return this.detach.apply(this,arguments);},_getFacade:function(){var H=this._facade,K,I=this.details,J;if(!H){H=new G.EventFacade(this,this.currentTarget);}K=I&&I[0];if(G.Lang.isObject(K,true)){J={};G.mix(J,H,true,D);G.mix(H,K,true);G.mix(H,J,true,D);}H.details=this.details;H.target=this.target;H.currentTarget=this.currentTarget;H.stopped=0;H.prevented=0;this._facade=H;return this._facade;},_notify:function(L,J,H){this.log(this.type+"->"+": "+L);var I,K;if(this.emitFacade){if(!H){H=this._getFacade(J);if(G.Lang.isObject(J[0])){J[0]=H;}else{J.unshift(H);}}}I=L.notify(K||this.context,J,this);if(false===I||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(I,H){if(!this.silent){}},fire:function(){var Q=G.Env._eventstack,J,S,P,K,L,H,M,I,N,O=true,R;if(Q){if(this.queuable&&this.type!=Q.next.type){this.log("queue "+this.type);Q.queue.push([this,arguments]);return true;}}else{G.Env._eventstack={id:this.id,next:this,silent:this.silent,logging:(this.type===B),stopped:0,prevented:0,queue:[]};Q=G.Env._eventstack;}if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");}else{P=G.Array(arguments,0,true);this.stopped=0;this.prevented=0;this.target=this.target||this.host;R=new G.EventTarget({fireOnce:true,context:this.host});this.events=R;if(this.preventedFn){R.on("prevented",this.preventedFn);}if(this.stoppedFn){R.on("stopped",this.stoppedFn);}this.currentTarget=this.host||this.currentTarget;this.fired=true;this.details=P.slice();this.log("Firing "+this.type);N=false;Q.lastLogState=Q.logging;L=null;if(this.emitFacade){this._facade=null;L=this._getFacade(P);if(G.Lang.isObject(P[0])){P[0]=L;}else{P.unshift(L);}}if(this.hasSubscribers){J=G.merge(this.subscribers);for(K in J){if(J.hasOwnProperty(K)){if(!N){Q.logging=(Q.logging||(this.type===B));N=true;}if(this.stopped==2){break;}S=J[K];if(S&&S.fn){O=this._notify(S,P,L);if(false===O){this.stopped=2;}}}}}Q.logging=(Q.lastLogState);if(this.bubbles&&this.host&&!this.stopped){Q.stopped=0;Q.prevented=0;O=this.host.bubble(this);this.stopped=Math.max(this.stopped,Q.stopped);this.prevented=Math.max(this.prevented,Q.prevented);}if(this.defaultFn&&!this.prevented){this.defaultFn.apply(this.host||this,P);}if(!this.stopped&&this.broadcast){if(this.host!==G){G.fire.apply(G,P);}if(this.broadcast==2){G.Global.fire.apply(G.Global,P);
}}if(this.hasAfters&&!this.prevented&&this.stopped<2){J=G.merge(this.afters);for(K in J){if(J.hasOwnProperty(K)){if(!N){Q.logging=(Q.logging||(this.type===B));N=true;}if(this.stopped==2){break;}S=J[K];if(S&&S.fn){O=this._notify(S,P,L);if(false===O){this.stopped=2;}}}}}}if(Q.id===this.id){M=Q.queue;while(M.length){H=M.pop();I=H[0];Q.stopped=0;Q.prevented=0;Q.next=I;O=I.fire.apply(I,H[1]);}G.Env._eventstack=null;}return(O!==false);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},detachAll:function(){var J=this.subscribers,I,H=0;for(I in J){if(J.hasOwnProperty(I)){this._delete(J[I]);H++;}}this.subscribers={};return H;},_delete:function(H){if(H){delete H.fn;delete H.context;delete this.subscribers[H.id];delete this.afters[H.id];}},toString:function(){return this.type;},stopPropagation:function(){this.stopped=1;G.Env._eventstack.stopped=1;this.events.fire("stopped",this);},stopImmediatePropagation:function(){this.stopped=2;G.Env._eventstack.stopped=2;this.events.fire("stopped",this);},preventDefault:function(){if(this.preventable){this.prevented=1;G.Env._eventstack.prevented=1;this.events.fire("prevented",this);}},halt:function(H){if(H){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();}};G.Subscriber=function(J,I,H){this.fn=J;this.context=I;this.id=G.stamp(this);this.wrappedFn=J;this.events=null;if(I){this.wrappedFn=G.rbind.apply(G,H);}};G.Subscriber.prototype={notify:function(H,J,M){var N=this.context||H,I=true,K=function(){switch(M.signature){case 0:I=this.fn.call(N,M.type,J,this.context);break;case 1:I=this.fn.call(N,J[0]||null,this.context);break;default:I=this.wrappedFn.apply(N,J||[]);}};if(G.config.throwFail){K.call(this);}else{try{K.call(this);}catch(L){G.error(this+" failed: "+L.message,L);}}return I;},contains:function(I,H){if(H){return((this.fn==I)&&this.context==H);}else{return(this.fn==I);}},toString:function(){return"Subscriber "+this.id;}};(function(){var H=G.Lang,I=":",J=/[,|]\s*/,K="~AFTER~",M=function(L){var O=(H.isObject(L))?L:{},N={context:O.context||this,host:this,emitFacade:O.emitFacade,fireOnce:O.fireOnce,queuable:O.queuable,broadcast:O.broadcast,bubbles:("bubbles" in O)?O.bubbles:true};this._yuievt={id:G.guid(),events:{},targets:{},config:O,chain:("chain" in O)?O.chain:G.config.chain,defaults:N,defaultkeys:G.Object.keys(N)};this._getType=G.cached(function(Q){var P=Q,R=this._yuievt.config.prefix;if(!H.isString(P)){return P;}if(P=="*"){return null;}if(P.indexOf(I)==-1&&R){P=R+I+P;}return P;});this._parseType=G.cached(function(R){var Q=R,V,S,W,P,T,U=this._yuievt.config.prefix;if(!H.isString(Q)){return Q;}P=Q.indexOf(K);if(P>-1){W=true;Q=Q.substr(K.length);}V=Q.split(J);if(V.length>1){S=V[0];Q=V[1];}T=this._getType(Q);return[S,T,W,Q];});};M.prototype={on:function(Z,a,N){var Q=this._parseType(Z),T,Y,W,V,O,X,S,b=G.Env.evt.handles,L,R,d,U=G.Node,P;if(H.isObject(Z,true)){T=a;Y=N;W=G.Array(arguments,0,true);V={};L=Z._after;delete Z._after;G.each(Z,function(e,c){if(e){T=e.fn||((G.Lang.isFunction(e))?e:T);Y=e.context||Y;}W[0]=(L)?K+c:c;W[1]=T;W[2]=Y;V[c]=this.on.apply(this,W);},this);return(this._yuievt.chain)?this:V;}else{if(H.isFunction(Z)){return G.Do.before.apply(G.Do,arguments);}}X=Q[0];L=Q[2];d=Q[3];if(U&&(this instanceof U)&&(d in U.DOM_EVENTS)){W=G.Array(arguments,0,true);W.splice(2,0,U.getDOMNode(this));return G.on.apply(G,W);}Z=Q[1];if(this instanceof YUI){R=G.Env.evt.plugins[Z];W=G.Array(arguments,0,true);W[0]=d;if(R&&R.on){P=W[2];if(U&&P&&(P instanceof U)){W[2]=U.getDOMNode(P);}S=R.on.apply(G,W);}else{if((!Z)||(!R&&U&&(d in U.DOM_EVENTS))){S=G.Event.attach.apply(G.Event,W);}}}if(!S){O=this._yuievt.events[Z]||this.publish(Z);W=G.Array(arguments,1,true);T=(L)?O.after:O.on;S=T.apply(O,W);}if(X){b[X]=b[X]||{};b[X][Z]=b[X][Z]||[];b[X][Z].push(S);}return(this._yuievt.chain)?this:S;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(W,Y,L){var P=this._parseType(W),V=H.isArray(P)?P[0]:null,b=(P)?P[3]:null,R,S,Z=G.Env.evt.handles,X,U,a=this._yuievt.events,O,Q,T=true,N=function(e,d){var c=e[d];if(c){while(c.length){R=c.pop();R.detach();}}};if(V){X=Z[V];W=P[1];if(X){if(W){N(X,W);}else{for(Q in X){if(X.hasOwnProperty(Q)){N(X,Q);}}}return(this._yuievt.chain)?this:true;}}else{if(H.isObject(W)&&W.detach){T=W.detach();return(this._yuievt.chain)?this:true;}else{if(G.Node&&(this instanceof G.Node)&&((!b)||(b in G.Node.DOM_EVENTS))){U=G.Array(arguments,0,true);U[2]=G.Node.getDOMNode(this);return G.detach.apply(G,U);}}}S=G.Env.evt.plugins[b];if(this instanceof YUI){U=G.Array(arguments,0,true);if(S&&S.detach){return S.detach.apply(G,U);}else{if(!W||(!S&&W.indexOf(":")==-1)){U[0]=W;return G.Event.detach.apply(G.Event,U);}}}if(W){O=a[W];if(O){return O.detach(Y,L);}}else{for(Q in a){if(a.hasOwnProperty(Q)){T=T&&a[Q].detach(Y,L);}}return T;}return(this._yuievt.chain)?this:false;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(L){L=this._getType(L);return this.detach(L);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(O,P){var N,R,L,S=P||{},Q=this._yuievt;O=this._getType(O);if(H.isObject(O)){L={};G.each(O,function(U,T){L[T]=this.publish(T,U||P);},this);return L;}N=Q.events;R=N[O];if(R){if(P){R.applyConfig(P,true);}}else{G.mix(S,Q.defaults,false,Q.defaultkeys);R=new G.CustomEvent(O,S);N[O]=R;}if(typeof S==G.CustomEvent){N[O].broadcast=false;}return N[O];},addTarget:function(L){this._yuievt.targets[G.stamp(L)]=L;this._yuievt.hasTargets=true;},removeTarget:function(L){delete this._yuievt.targets[G.stamp(L)];},fire:function(P){var R=H.isString(P),O=(R)?P:(P&&P.type),Q,L,N;O=this._getType(O);Q=this.getEvent(O);if(!Q){if(this._yuievt.hasTargets){Q=this.publish(O);Q.details=G.Array(arguments,(R)?1:0,true);return this.bubble(Q);}N=true;}else{L=G.Array(arguments,(R)?1:0,true);N=Q.fire.apply(Q,L);Q.target=null;}return(this._yuievt.chain)?this:N;},getEvent:function(L){L=this._getType(L);var N=this._yuievt.events;return(N&&L in N)?N[L]:null;},bubble:function(N){var S=this._yuievt.targets,O=true,Q,R,T,L,P;
if(!N.stopped&&S){for(P in S){if(S.hasOwnProperty(P)){Q=S[P];R=N.type;T=Q.getEvent(R);L=N.target||this;if(!T){T=Q.publish(R,N);T.context=(N.host===N.context)?Q:N.context;T.host=Q;T.defaultFn=null;T.preventedFn=null;T.stoppedFn=null;}T.target=L;T.currentTarget=Q;O=O&&T.fire.apply(T,N.details);if(T.stopped){break;}}}}return O;},after:function(O,N){var L=G.Array(arguments,0,true);switch(H.type(O)){case"function":return G.Do.after.apply(G.Do,arguments);case"object":L[0]._after=true;break;default:L[0]=K+O;}return this.on.apply(this,L);},before:function(){return this.on.apply(this,arguments);}};G.EventTarget=M;G.mix(G,M.prototype,false,false,{bubbles:false});M.call(G);YUI.Env.globalEvents=YUI.Env.globalEvents||new M();G.Global=YUI.Env.globalEvents;})();},"@VERSION@",{requires:["oop"]});