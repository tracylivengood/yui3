YUI.add("test",function(f,e){if(YUI.YUITest){f.Test=YUI.YUITest;}else{YUITest={version:"@VERSION@",guid:function(g){return f.guid(g);}};f.namespace("Test");YUITest.Object=f.Object;YUITest.Array=f.Array;YUITest.Util={mix:f.mix,JSON:f.JSON};YUITest.EventTarget=function(){this._handlers={};};YUITest.EventTarget.prototype={constructor:YUITest.EventTarget,attach:function(g,h){if(typeof this._handlers[g]=="undefined"){this._handlers[g]=[];}this._handlers[g].push(h);},subscribe:function(g,h){this.attach.apply(this,arguments);},fire:function(k){if(typeof k=="string"){k={type:k};}if(!k.target){k.target=this;}if(!k.type){throw new Error("Event object missing 'type' property.");}if(this._handlers[k.type] instanceof Array){var h=this._handlers[k.type];for(var j=0,g=h.length;j<g;j++){h[j].call(this,k);}}},detach:function(k,l){if(this._handlers[k] instanceof Array){var h=this._handlers[k];for(var j=0,g=h.length;j<g;j++){if(h[j]===l){h.splice(j,1);break;}}}},unsubscribe:function(g,h){this.detach.apply(this,arguments);}};YUITest.TestSuite=function(g){this.name="";this.items=[];if(typeof g=="string"){this.name=g;}else{if(g instanceof Object){for(var h in g){if(g.hasOwnProperty(h)){this[h]=g[h];}}}}if(this.name===""||!this.name){this.name=YUITest.guid("testSuite_");}};YUITest.TestSuite.prototype={constructor:YUITest.TestSuite,add:function(g){if(g instanceof YUITest.TestSuite||g instanceof YUITest.TestCase){this.items.push(g);}return this;},setUp:function(){},tearDown:function(){}};YUITest.TestCase=function(g){this._should={};for(var h in g){this[h]=g[h];}if(typeof this.name!="string"){this.name=YUITest.guid("testCase_");}};YUITest.TestCase.prototype={constructor:YUITest.TestCase,callback:function(){return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);},resume:function(g){YUITest.TestRunner.resume(g);},wait:function(i,g){var h=(typeof i=="number"?i:g);h=(typeof h=="number"?h:10000);if(typeof i=="function"){throw new YUITest.Wait(i,h);}else{throw new YUITest.Wait(function(){YUITest.Assert.fail("Timeout: wait() called but resume() never called.");},h);}},assert:function(h,g){YUITest.Assert._increment();if(!h){throw new YUITest.AssertionError(YUITest.Assert._formatMessage(g,"Assertion failed."));}},fail:function(g){YUITest.Assert.fail(g);},init:function(){},destroy:function(){},setUp:function(){},tearDown:function(){}};YUITest.TestFormat=function(){function g(h){return h.replace(/[<>"'&]/g,function(i){switch(i){case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&apos;";case"&":return"&amp;";}});}return{JSON:function(h){return YUITest.Util.JSON.stringify(h);},XML:function(i){function h(k){var j="<"+k.type+' name="'+g(k.name)+'"';if(typeof(k.duration)=="number"){j+=' duration="'+k.duration+'"';}if(k.type=="test"){j+=' result="'+k.result+'" message="'+g(k.message)+'">';}else{j+=' passed="'+k.passed+'" failed="'+k.failed+'" ignored="'+k.ignored+'" total="'+k.total+'">';for(var l in k){if(k.hasOwnProperty(l)){if(k[l]&&typeof k[l]=="object"&&!(k[l] instanceof Array)){j+=h(k[l]);}}}}j+="</"+k.type+">";return j;}return'<?xml version="1.0" encoding="UTF-8"?>'+h(i);},JUnitXML:function(h){function i(k){var j="";switch(k.type){case"test":if(k.result!="ignore"){j='<testcase name="'+g(k.name)+'" time="'+(k.duration/1000)+'">';if(k.result=="fail"){j+='<failure message="'+g(k.message)+'"><![CDATA['+k.message+"]]></failure>";}j+="</testcase>";}break;case"testcase":j='<testsuite name="'+g(k.name)+'" tests="'+k.total+'" failures="'+k.failed+'" time="'+(k.duration/1000)+'">';for(var l in k){if(k.hasOwnProperty(l)){if(k[l]&&typeof k[l]=="object"&&!(k[l] instanceof Array)){j+=i(k[l]);}}}j+="</testsuite>";break;case"testsuite":for(var l in k){if(k.hasOwnProperty(l)){if(k[l]&&typeof k[l]=="object"&&!(k[l] instanceof Array)){j+=i(k[l]);}}}break;case"report":j="<testsuites>";for(var l in k){if(k.hasOwnProperty(l)){if(k[l]&&typeof k[l]=="object"&&!(k[l] instanceof Array)){j+=i(k[l]);}}}j+="</testsuites>";}return j;}return'<?xml version="1.0" encoding="UTF-8"?>'+i(h);},TAP:function(i){var j=1;function h(k){var l="";switch(k.type){case"test":if(k.result!="ignore"){l="ok "+(j++)+" - "+k.name;if(k.result=="fail"){l="not "+l+" - "+k.message;}l+="\n";}else{l="#Ignored test "+k.name+"\n";}break;case"testcase":l="#Begin testcase "+k.name+"("+k.failed+" failed of "+k.total+")\n";for(var m in k){if(k.hasOwnProperty(m)){if(k[m]&&typeof k[m]=="object"&&!(k[m] instanceof Array)){l+=h(k[m]);}}}l+="#End testcase "+k.name+"\n";break;case"testsuite":l="#Begin testsuite "+k.name+"("+k.failed+" failed of "+k.total+")\n";for(var m in k){if(k.hasOwnProperty(m)){if(k[m]&&typeof k[m]=="object"&&!(k[m] instanceof Array)){l+=h(k[m]);}}}l+="#End testsuite "+k.name+"\n";break;case"report":for(var m in k){if(k.hasOwnProperty(m)){if(k[m]&&typeof k[m]=="object"&&!(k[m] instanceof Array)){l+=h(k[m]);}}}}return l;}return"1.."+i.total+"\n"+h(i);}};}();YUITest.Reporter=function(g,h){this.url=g;this.format=h||YUITest.TestFormat.XML;this._fields=new Object();this._form=null;this._iframe=null;};YUITest.Reporter.prototype={constructor:YUITest.Reporter,addField:function(g,h){this._fields[g]=h;},clearFields:function(){this._fields=new Object();},destroy:function(){if(this._form){this._form.parentNode.removeChild(this._form);this._form=null;}if(this._iframe){this._iframe.parentNode.removeChild(this._iframe);this._iframe=null;}this._fields=null;},report:function(i){if(!this._form){this._form=document.createElement("form");this._form.method="post";this._form.style.visibility="hidden";this._form.style.position="absolute";this._form.style.top=0;document.body.appendChild(this._form);try{this._iframe=document.createElement('<iframe name="yuiTestTarget" />');}catch(h){this._iframe=document.createElement("iframe");this._iframe.name="yuiTestTarget";}this._iframe.src="javascript:false";this._iframe.style.visibility="hidden";this._iframe.style.position="absolute";this._iframe.style.top=0;document.body.appendChild(this._iframe);this._form.target="yuiTestTarget";
}this._form.action=this.url;while(this._form.hasChildNodes()){this._form.removeChild(this._form.lastChild);}this._fields.results=this.format(i);this._fields.useragent=navigator.userAgent;this._fields.timestamp=(new Date()).toLocaleString();for(var k in this._fields){var j=this._fields[k];if(this._fields.hasOwnProperty(k)&&(typeof j!="function")){var g=document.createElement("input");g.type="hidden";g.name=k;g.value=j;this._form.appendChild(g);}}delete this._fields.results;delete this._fields.useragent;delete this._fields.timestamp;if(arguments[1]!==false){this._form.submit();}}};YUITest.TestRunner=function(){function i(k,m){if(!m.length){return true;}else{if(k){for(var l=0,j=k.length;l<j;l++){if(m.indexOf(","+k[l]+",")>-1){return true;}}}return false;}}function h(j){this.testObject=j;this.firstChild=null;this.lastChild=null;this.parent=null;this.next=null;this.results=new YUITest.Results();if(j instanceof YUITest.TestSuite){this.results.type="testsuite";this.results.name=j.name;}else{if(j instanceof YUITest.TestCase){this.results.type="testcase";this.results.name=j.name;}}}h.prototype={appendChild:function(j){var k=new h(j);if(this.firstChild===null){this.firstChild=this.lastChild=k;}else{this.lastChild.next=k;this.lastChild=k;}k.parent=this;return k;}};function g(){YUITest.EventTarget.call(this);this.masterSuite=new YUITest.TestSuite(YUITest.guid("testSuite_"));this._cur=null;this._root=null;this._log=true;this._waiting=false;this._running=false;this._lastResults=null;this._context=null;this._groups="";}g.prototype=YUITest.Util.mix(new YUITest.EventTarget(),{_ignoreEmpty:false,constructor:YUITest.TestRunner,TEST_CASE_BEGIN_EVENT:"testcasebegin",TEST_CASE_COMPLETE_EVENT:"testcasecomplete",TEST_SUITE_BEGIN_EVENT:"testsuitebegin",TEST_SUITE_COMPLETE_EVENT:"testsuitecomplete",TEST_PASS_EVENT:"pass",TEST_FAIL_EVENT:"fail",ERROR_EVENT:"error",TEST_IGNORE_EVENT:"ignore",COMPLETE_EVENT:"complete",BEGIN_EVENT:"begin",_addTestCaseToTestTree:function(k,l){var m=k.appendChild(l),n,j;for(n in l){if((n.indexOf("test")===0||n.indexOf(" ")>-1)&&typeof l[n]=="function"){m.appendChild(n);}}},_addTestSuiteToTestTree:function(j,m){var l=j.appendChild(m);for(var k=0;k<m.items.length;k++){if(m.items[k] instanceof YUITest.TestSuite){this._addTestSuiteToTestTree(l,m.items[k]);}else{if(m.items[k] instanceof YUITest.TestCase){this._addTestCaseToTestTree(l,m.items[k]);}}}},_buildTestTree:function(){this._root=new h(this.masterSuite);for(var j=0;j<this.masterSuite.items.length;j++){if(this.masterSuite.items[j] instanceof YUITest.TestSuite){this._addTestSuiteToTestTree(this._root,this.masterSuite.items[j]);}else{if(this.masterSuite.items[j] instanceof YUITest.TestCase){this._addTestCaseToTestTree(this._root,this.masterSuite.items[j]);}}}},_handleTestObjectComplete:function(k){var j;if(k&&(typeof k.testObject=="object")){j=k.parent;if(j){j.results.include(k.results);j.results[k.testObject.name]=k.results;}if(k.testObject instanceof YUITest.TestSuite){this._execNonTestMethod(k,"tearDown",false);k.results.duration=(new Date())-k._start;this.fire({type:this.TEST_SUITE_COMPLETE_EVENT,testSuite:k.testObject,results:k.results});}else{if(k.testObject instanceof YUITest.TestCase){this._execNonTestMethod(k,"destroy",false);k.results.duration=(new Date())-k._start;this.fire({type:this.TEST_CASE_COMPLETE_EVENT,testCase:k.testObject,results:k.results});}}}},_next:function(){if(this._cur===null){this._cur=this._root;}else{if(this._cur.firstChild){this._cur=this._cur.firstChild;}else{if(this._cur.next){this._cur=this._cur.next;}else{while(this._cur&&!this._cur.next&&this._cur!==this._root){this._handleTestObjectComplete(this._cur);this._cur=this._cur.parent;}this._handleTestObjectComplete(this._cur);if(this._cur==this._root){this._cur.results.type="report";this._cur.results.timestamp=(new Date()).toLocaleString();this._cur.results.duration=(new Date())-this._cur._start;this._lastResults=this._cur.results;this._running=false;this.fire({type:this.COMPLETE_EVENT,results:this._lastResults});this._cur=null;}else{if(this._cur){this._cur=this._cur.next;}}}}}return this._cur;},_execNonTestMethod:function(n,j,o){var k=n.testObject,m={type:this.ERROR_EVENT};try{if(o&&k["async:"+j]){k["async:"+j](this._context);return true;}else{k[j](this._context);}}catch(l){n.results.errors++;m.error=l;m.methodName=j;if(k instanceof YUITest.TestCase){m.testCase=k;}else{m.testSuite=testSuite;}this.fire(m);}return false;},_run:function(){var l=false;var k=this._next();if(k!==null){this._running=true;this._lastResult=null;var j=k.testObject;if(typeof j=="object"&&j!==null){if(j instanceof YUITest.TestSuite){this.fire({type:this.TEST_SUITE_BEGIN_EVENT,testSuite:j});k._start=new Date();this._execNonTestMethod(k,"setUp",false);}else{if(j instanceof YUITest.TestCase){this.fire({type:this.TEST_CASE_BEGIN_EVENT,testCase:j});k._start=new Date();if(this._execNonTestMethod(k,"init",true)){return;}}}if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}}else{this._runTest(k);}}},_resumeTest:function(o){var j=this._cur;this._waiting=false;if(!j){return;}var p=j.testObject;var m=j.parent.testObject;if(m.__yui_wait){clearTimeout(m.__yui_wait);delete m.__yui_wait;}var s=p.indexOf("fail:")===0||(m._should.fail||{})[p];var k=(m._should.error||{})[p];var n=false;var q=null;try{o.call(m,this._context);if(YUITest.Assert._getCount()==0&&!this._ignoreEmpty){throw new YUITest.AssertionError("Test has no asserts.");}else{if(s){q=new YUITest.ShouldFail();n=true;}else{if(k){q=new YUITest.ShouldError();n=true;}}}}catch(r){if(m.__yui_wait){clearTimeout(m.__yui_wait);delete m.__yui_wait;}if(r instanceof YUITest.AssertionError){if(!s){q=r;n=true;}}else{if(r instanceof YUITest.Wait){if(typeof r.segment=="function"){if(typeof r.delay=="number"){if(typeof setTimeout!="undefined"){m.__yui_wait=setTimeout(function(){YUITest.TestRunner._resumeTest(r.segment);},r.delay);this._waiting=true;}else{throw new Error("Asynchronous tests not supported in this environment.");
}}}return;}else{if(!k){q=new YUITest.UnexpectedError(r);n=true;}else{if(typeof k=="string"){if(r.message!=k){q=new YUITest.UnexpectedError(r);n=true;}}else{if(typeof k=="function"){if(!(r instanceof k)){q=new YUITest.UnexpectedError(r);n=true;}}else{if(typeof k=="object"&&k!==null){if(!(r instanceof k.constructor)||r.message!=k.message){q=new YUITest.UnexpectedError(r);n=true;}}}}}}}}if(n){this.fire({type:this.TEST_FAIL_EVENT,testCase:m,testName:p,error:q});}else{this.fire({type:this.TEST_PASS_EVENT,testCase:m,testName:p});}this._execNonTestMethod(j.parent,"tearDown",false);YUITest.Assert._reset();var l=(new Date())-j._start;j.parent.results[p]={result:n?"fail":"pass",message:q?q.getMessage():"Test passed",type:"test",name:p,duration:l};if(n){j.parent.results.failed++;}else{j.parent.results.passed++;}j.parent.results.total++;if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}},_handleError:function(j){if(this._waiting){this._resumeTest(function(){throw j;});}else{throw j;}},_runTest:function(m){var j=m.testObject,k=m.parent.testObject,n=k[j],l=j.indexOf("ignore:")===0||!i(k.groups,this._groups)||(k._should.ignore||{})[j];if(l){m.parent.results[j]={result:"ignore",message:"Test ignored",type:"test",name:j.indexOf("ignore:")===0?j.substring(7):j};m.parent.results.ignored++;m.parent.results.total++;this.fire({type:this.TEST_IGNORE_EVENT,testCase:k,testName:j});if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}}else{m._start=new Date();this._execNonTestMethod(m.parent,"setUp",false);this._resumeTest(n);}},getName:function(){return this.masterSuite.name;},setName:function(j){this.masterSuite.name=j;},add:function(j){this.masterSuite.add(j);return this;},clear:function(){this.masterSuite=new YUITest.TestSuite(YUITest.guid("testSuite_"));},isWaiting:function(){return this._waiting;},isRunning:function(){return this._running;},getResults:function(j){if(!this._running&&this._lastResults){if(typeof j=="function"){return j(this._lastResults);}else{return this._lastResults;}}else{return null;}},getCoverage:function(j){if(!this._running&&typeof _yuitest_coverage=="object"){if(typeof j=="function"){return j(_yuitest_coverage);}else{return _yuitest_coverage;}}else{return null;}},callback:function(){var l=arguments,k=this._context,j=this;return function(){for(var m=0;m<arguments.length;m++){k[l[m]]=arguments[m];}j._run();};},resume:function(j){if(this._waiting){this._resumeTest(j||function(){});}else{throw new Error("resume() called without wait().");}},run:function(k){k=k||{};var l=YUITest.TestRunner,j=k.oldMode;if(!j&&this.masterSuite.items.length==1&&this.masterSuite.items[0] instanceof YUITest.TestSuite){this.masterSuite=this.masterSuite.items[0];}l._groups=(k.groups instanceof Array)?","+k.groups.join(",")+",":"";l._buildTestTree();l._context={};l._root._start=new Date();l.fire(l.BEGIN_EVENT);l._run();}});return new g();}();YUITest.ArrayAssert={_indexOf:function(h,j){if(h.indexOf){return h.indexOf(j);}else{for(var g=0;g<h.length;g++){if(h[g]===j){return g;}}return -1;}},_some:function(h,j){if(h.some){return h.some(j);}else{for(var g=0;g<h.length;g++){if(j(h[g])){return true;}}return false;}},contains:function(i,h,g){YUITest.Assert._increment();if(this._indexOf(h,i)==-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"Value "+i+" ("+(typeof i)+") not found in array ["+h+"]."));}},containsItems:function(j,k,h){YUITest.Assert._increment();for(var g=0;g<j.length;g++){if(this._indexOf(k,j[g])==-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(h,"Value "+j[g]+" ("+(typeof j[g])+") not found in array ["+k+"]."));}}},containsMatch:function(i,h,g){YUITest.Assert._increment();if(typeof i!="function"){throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");}if(!this._some(h,i)){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"No match found in array ["+h+"]."));}},doesNotContain:function(i,h,g){YUITest.Assert._increment();if(this._indexOf(h,i)>-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"Value found in array ["+h+"]."));}},doesNotContainItems:function(j,k,h){YUITest.Assert._increment();for(var g=0;g<j.length;g++){if(this._indexOf(k,j[g])>-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(h,"Value found in array ["+k+"]."));}}},doesNotContainMatch:function(i,h,g){YUITest.Assert._increment();if(typeof i!="function"){throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");}if(this._some(h,i)){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"Value found in array ["+h+"]."));}},indexOf:function(l,k,g,j){YUITest.Assert._increment();for(var h=0;h<k.length;h++){if(k[h]===l){if(g!=h){YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Value exists at index "+h+" but should be at index "+g+"."));}return;}}YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Value doesn't exist in array ["+k+"]."));},itemsAreEqual:function(j,k,h){YUITest.Assert._increment();if(typeof j!="object"||typeof k!="object"){YUITest.Assert.fail(YUITest.Assert._formatMessage(h,"Value should be an array."));}if(j.length!=k.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(h,"Array should have a length of "+j.length+" but has a length of "+k.length+"."));}for(var g=0;g<j.length;g++){if(j[g]!=k[g]){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(h,"Values in position "+g+" are not equal."),j[g],k[g]);}}},itemsAreEquivalent:function(k,l,g,j){YUITest.Assert._increment();if(typeof g!="function"){throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");}if(k.length!=l.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Array should have a length of "+k.length+" but has a length of "+l.length));}for(var h=0;h<k.length;h++){if(!g(k[h],l[h])){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(j,"Values in position "+h+" are not equivalent."),k[h],l[h]);}}},isEmpty:function(h,g){YUITest.Assert._increment();
if(h.length>0){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"Array should be empty."));}},isNotEmpty:function(h,g){YUITest.Assert._increment();if(h.length===0){YUITest.Assert.fail(YUITest.Assert._formatMessage(g,"Array should not be empty."));}},itemsAreSame:function(j,k,h){YUITest.Assert._increment();if(j.length!=k.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(h,"Array should have a length of "+j.length+" but has a length of "+k.length));}for(var g=0;g<j.length;g++){if(j[g]!==k[g]){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(h,"Values in position "+g+" are not the same."),j[g],k[g]);}}},lastIndexOf:function(l,k,g,j){for(var h=k.length;h>=0;h--){if(k[h]===l){if(g!=h){YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Value exists at index "+h+" but should be at index "+g+"."));}return;}}YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Value doesn't exist in array."));}};YUITest.Assert={_asserts:0,_formatMessage:function(h,g){if(typeof h=="string"&&h.length>0){return h.replace("{message}",g);}else{return g;}},_getCount:function(){return this._asserts;},_increment:function(){this._asserts++;},_reset:function(){this._asserts=0;},fail:function(g){throw new YUITest.AssertionError(YUITest.Assert._formatMessage(g,"Test force-failed."));},pass:function(g){YUITest.Assert._increment();},areEqual:function(h,i,g){YUITest.Assert._increment();if(h!=i){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Values should be equal."),h,i);}},areNotEqual:function(g,i,h){YUITest.Assert._increment();if(g==i){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(h,"Values should not be equal."),g);}},areNotSame:function(g,i,h){YUITest.Assert._increment();if(g===i){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(h,"Values should not be the same."),g);}},areSame:function(h,i,g){YUITest.Assert._increment();if(h!==i){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Values should be the same."),h,i);}},isFalse:function(h,g){YUITest.Assert._increment();if(false!==h){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value should be false."),false,h);}},isTrue:function(h,g){YUITest.Assert._increment();if(true!==h){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value should be true."),true,h);}},isNaN:function(h,g){YUITest.Assert._increment();if(!isNaN(h)){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value should be NaN."),NaN,h);}},isNotNaN:function(h,g){YUITest.Assert._increment();if(isNaN(h)){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Values should not be NaN."),NaN);}},isNotNull:function(h,g){YUITest.Assert._increment();if(h===null){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Values should not be null."),null);}},isNotUndefined:function(h,g){YUITest.Assert._increment();if(typeof h=="undefined"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should not be undefined."),undefined);}},isNull:function(h,g){YUITest.Assert._increment();if(h!==null){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value should be null."),null,h);}},isUndefined:function(h,g){YUITest.Assert._increment();if(typeof h!="undefined"){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value should be undefined."),undefined,h);}},isArray:function(i,h){YUITest.Assert._increment();var g=false;if(Array.isArray){g=!Array.isArray(i);}else{g=Object.prototype.toString.call(i)!="[object Array]";}if(g){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(h,"Value should be an array."),i);}},isBoolean:function(h,g){YUITest.Assert._increment();if(typeof h!="boolean"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should be a Boolean."),h);}},isFunction:function(h,g){YUITest.Assert._increment();if(!(h instanceof Function)){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should be a function."),h);}},isInstanceOf:function(h,i,g){YUITest.Assert._increment();if(!(i instanceof h)){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,"Value isn't an instance of expected type."),h,i);}},isNumber:function(h,g){YUITest.Assert._increment();if(typeof h!="number"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should be a number."),h);}},isObject:function(h,g){YUITest.Assert._increment();if(!h||(typeof h!="object"&&typeof h!="function")){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should be an object."),h);}},isString:function(h,g){YUITest.Assert._increment();if(typeof h!="string"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(g,"Value should be a string."),h);}},isTypeOf:function(g,i,h){YUITest.Assert._increment();if(typeof i!=g){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(h,"Value should be of type "+g+"."),g,typeof i);}},throwsError:function(j,k,i){YUITest.Assert._increment();var g=false;try{k();}catch(h){if(typeof j=="string"){if(h.message!=j){g=true;}}else{if(typeof j=="function"){if(!(h instanceof j)){g=true;}}else{if(typeof j=="object"&&j!==null){if(!(h instanceof j.constructor)||h.message!=j.message){g=true;}}else{g=true;}}}if(g){throw new YUITest.UnexpectedError(h);}else{return;}}throw new YUITest.AssertionError(YUITest.Assert._formatMessage(i,"Error should have been thrown."));}};YUITest.AssertionError=function(g){this.message=g;this.name="Assert Error";};YUITest.AssertionError.prototype={constructor:YUITest.AssertionError,getMessage:function(){return this.message;},toString:function(){return this.name+": "+this.getMessage();}};YUITest.ComparisonFailure=function(h,g,i){YUITest.AssertionError.call(this,h);this.expected=g;this.actual=i;this.name="ComparisonFailure";};YUITest.ComparisonFailure.prototype=new YUITest.AssertionError;YUITest.ComparisonFailure.prototype.constructor=YUITest.ComparisonFailure;YUITest.ComparisonFailure.prototype.getMessage=function(){return this.message+"\nExpected: "+this.expected+" ("+(typeof this.expected)+")"+"\nActual: "+this.actual+" ("+(typeof this.actual)+")";
};YUITest.CoverageFormat={JSON:function(g){return YUITest.Util.JSON.stringify(g);},XdebugJSON:function(h){var g={};for(var i in h){if(h.hasOwnProperty(i)){g[i]=h[i].lines;}}return YUITest.Util.JSON.stringify(h);}};YUITest.DateAssert={datesAreEqual:function(h,j,g){YUITest.Assert._increment();if(h instanceof Date&&j instanceof Date){var i="";if(h.getFullYear()!=j.getFullYear()){i="Years should be equal.";}if(h.getMonth()!=j.getMonth()){i="Months should be equal.";}if(h.getDate()!=j.getDate()){i="Days of month should be equal.";}if(i.length){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,i),h,j);}}else{throw new TypeError("YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");}},timesAreEqual:function(h,j,g){YUITest.Assert._increment();if(h instanceof Date&&j instanceof Date){var i="";if(h.getHours()!=j.getHours()){i="Hours should be equal.";}if(h.getMinutes()!=j.getMinutes()){i="Minutes should be equal.";}if(h.getSeconds()!=j.getSeconds()){i="Seconds should be equal.";}if(i.length){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(g,i),h,j);}}else{throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");}}};YUITest.Mock=function(j){j=j||{};var g,h;try{function k(){}k.prototype=j;g=new k();}catch(i){g={};}for(h in j){if(j.hasOwnProperty(h)){if(typeof j[h]=="function"){g[h]=function(l){return function(){YUITest.Assert.fail("Method "+l+"() was called but was not expected to be.");};}(h);}}}return g;};YUITest.Mock.expect=function(n,j){if(!n.__expectations){n.__expectations={};}if(j.method){var g=j.method,o=j.args||[],q=j.returns,m=(typeof j.callCount=="number")?j.callCount:1,p=j.error,k=j.run||function(){},h,l;n.__expectations[g]=j;j.callCount=m;j.actualCallCount=0;for(l=0;l<o.length;l++){if(!(o[l] instanceof YUITest.Mock.Value)){o[l]=YUITest.Mock.Value(YUITest.Assert.areSame,[o[l]],"Argument "+l+" of "+g+"() is incorrect.");}}if(m>0){n[g]=function(){try{j.actualCallCount++;YUITest.Assert.areEqual(o.length,arguments.length,"Method "+g+"() passed incorrect number of arguments.");for(var t=0,r=o.length;t<r;t++){o[t].verify(arguments[t]);}h=k.apply(this,arguments);if(p){throw p;}}catch(s){YUITest.TestRunner._handleError(s);}return j.hasOwnProperty("returns")?q:h;};}else{n[g]=function(){try{YUITest.Assert.fail("Method "+g+"() should not have been called.");}catch(i){YUITest.TestRunner._handleError(i);}};}}else{if(j.property){n.__expectations[j.property]=j;}}};YUITest.Mock.verify=function(g){try{for(var i in g.__expectations){if(g.__expectations.hasOwnProperty(i)){var h=g.__expectations[i];if(h.method){YUITest.Assert.areEqual(h.callCount,h.actualCallCount,"Method "+h.method+"() wasn't called the expected number of times.");}else{if(h.property){YUITest.Assert.areEqual(h.value,g[h.property],"Property "+h.property+" wasn't set to the correct value.");}}}}}catch(j){YUITest.TestRunner._handleError(j);}};YUITest.Mock.Value=function(i,g,h){if(this instanceof YUITest.Mock.Value){this.verify=function(k){var j=[].concat(g||[]);j.push(k);j.push(h);i.apply(null,j);};}else{return new YUITest.Mock.Value(i,g,h);}};YUITest.Mock.Value.Any=YUITest.Mock.Value(function(){});YUITest.Mock.Value.Boolean=YUITest.Mock.Value(YUITest.Assert.isBoolean);YUITest.Mock.Value.Number=YUITest.Mock.Value(YUITest.Assert.isNumber);YUITest.Mock.Value.String=YUITest.Mock.Value(YUITest.Assert.isString);YUITest.Mock.Value.Object=YUITest.Mock.Value(YUITest.Assert.isObject);YUITest.Mock.Value.Function=YUITest.Mock.Value(YUITest.Assert.isFunction);YUITest.ObjectAssert={areEqual:function(j,l,i){YUITest.Assert._increment();var h=YUITest.Object.keys(j),k=YUITest.Object.keys(l);if(h.length!=k.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(i,"Object should have "+h.length+" keys but has "+k.length));}for(var g in j){if(j.hasOwnProperty(g)){if(j[g]!=l[g]){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(i,"Values should be equal for property "+g),j[g],l[g]);}}}},hasKey:function(g,h,i){YUITest.ObjectAssert.ownsOrInheritsKey(g,h,i);},hasKeys:function(h,g,i){YUITest.ObjectAssert.ownsOrInheritsKeys(h,g,i);},inheritsKey:function(g,h,i){YUITest.Assert._increment();if(!(g in h&&!h.hasOwnProperty(g))){YUITest.Assert.fail(YUITest.Assert._formatMessage(i,"Property '"+g+"' not found on object instance."));}},inheritsKeys:function(j,g,k){YUITest.Assert._increment();for(var h=0;h<j.length;h++){if(!(propertyName in g&&!g.hasOwnProperty(j[h]))){YUITest.Assert.fail(YUITest.Assert._formatMessage(k,"Property '"+j[h]+"' not found on object instance."));}}},ownsKey:function(g,h,i){YUITest.Assert._increment();if(!h.hasOwnProperty(g)){YUITest.Assert.fail(YUITest.Assert._formatMessage(i,"Property '"+g+"' not found on object instance."));}},ownsKeys:function(j,g,k){YUITest.Assert._increment();for(var h=0;h<j.length;h++){if(!g.hasOwnProperty(j[h])){YUITest.Assert.fail(YUITest.Assert._formatMessage(k,"Property '"+j[h]+"' not found on object instance."));}}},ownsNoKeys:function(h,j){YUITest.Assert._increment();var i=0,g;for(g in h){if(h.hasOwnProperty(g)){i++;}}if(i!==0){YUITest.Assert.fail(YUITest.Assert._formatMessage(j,"Object owns "+i+" properties but should own none."));}},ownsOrInheritsKey:function(g,h,i){YUITest.Assert._increment();if(!(g in h)){YUITest.Assert.fail(YUITest.Assert._formatMessage(i,"Property '"+g+"' not found on object."));}},ownsOrInheritsKeys:function(j,g,k){YUITest.Assert._increment();for(var h=0;h<j.length;h++){if(!(j[h] in g)){YUITest.Assert.fail(YUITest.Assert._formatMessage(k,"Property '"+j[h]+"' not found on object."));}}}};YUITest.Results=function(g){this.name=g;this.passed=0;this.failed=0;this.errors=0;this.ignored=0;this.total=0;this.duration=0;};YUITest.Results.prototype.include=function(g){this.passed+=g.passed;this.failed+=g.failed;this.ignored+=g.ignored;this.total+=g.total;this.errors+=g.errors;};YUITest.ShouldError=function(g){YUITest.AssertionError.call(this,g||"This test should have thrown an error but didn't.");
this.name="ShouldError";};YUITest.ShouldError.prototype=new YUITest.AssertionError();YUITest.ShouldError.prototype.constructor=YUITest.ShouldError;YUITest.ShouldFail=function(g){YUITest.AssertionError.call(this,g||"This test should fail but didn't.");this.name="ShouldFail";};YUITest.ShouldFail.prototype=new YUITest.AssertionError();YUITest.ShouldFail.prototype.constructor=YUITest.ShouldFail;YUITest.UnexpectedError=function(g){YUITest.AssertionError.call(this,"Unexpected error: "+g.message);this.cause=g;this.name="UnexpectedError";this.stack=g.stack;};YUITest.UnexpectedError.prototype=new YUITest.AssertionError();YUITest.UnexpectedError.prototype.constructor=YUITest.UnexpectedError;YUITest.UnexpectedValue=function(h,g){YUITest.AssertionError.call(this,h);this.unexpected=g;this.name="UnexpectedValue";};YUITest.UnexpectedValue.prototype=new YUITest.AssertionError();YUITest.UnexpectedValue.prototype.constructor=YUITest.UnexpectedValue;YUITest.UnexpectedValue.prototype.getMessage=function(){return this.message+"\nUnexpected: "+this.unexpected+" ("+(typeof this.unexpected)+") ";};YUITest.Wait=function(h,g){this.segment=(typeof h=="function"?h:null);this.delay=(typeof g=="number"?g:0);};f.Test=YUITest;f.Object.each(YUITest,function(h,g){var g=g.replace("Test","");f.Test[g]=h;});}f.Assert=YUITest.Assert;f.Assert.Error=f.Test.AssertionError;f.Assert.ComparisonFailure=f.Test.ComparisonFailure;f.Assert.UnexpectedValue=f.Test.UnexpectedValue;f.Mock=f.Test.Mock;f.ObjectAssert=f.Test.ObjectAssert;f.ArrayAssert=f.Test.ArrayAssert;f.DateAssert=f.Test.DateAssert;f.Test.ResultsFormat=f.Test.TestFormat;var a=f.Test.ArrayAssert.itemsAreEqual;f.Test.ArrayAssert.itemsAreEqual=function(h,i,g){return a.call(this,f.Array(h),f.Array(i),g);};f.assert=function(h,g){f.Assert._increment();if(!h){throw new f.Assert.Error(f.Assert._formatMessage(g,"Assertion failed."));}};f.fail=f.Assert.fail;f.Test.Runner.once=f.Test.Runner.subscribe;f.Test.Runner.disableLogging=function(){f.Test.Runner._log=false;};f.Test.Runner.enableLogging=function(){f.Test.Runner._log=true;};f.Test.Runner._ignoreEmpty=true;f.Test.Runner._log=true;f.Test.Runner.on=f.Test.Runner.attach;if(!YUI.YUITest){if(f.config.win){f.config.win.YUITest=YUITest;}YUI.YUITest=f.Test;var d=function(i){var h="";var g="";switch(i.type){case this.BEGIN_EVENT:h="Testing began at "+(new Date()).toString()+".";g="info";break;case this.COMPLETE_EVENT:h=f.Lang.sub("Testing completed at "+(new Date()).toString()+".\n"+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",i.results);g="info";break;case this.TEST_FAIL_EVENT:h=i.testName+": failed.\n"+i.error.getMessage();g="fail";break;case this.TEST_IGNORE_EVENT:h=i.testName+": ignored.";g="ignore";break;case this.TEST_PASS_EVENT:h=i.testName+": passed.";g="pass";break;case this.TEST_SUITE_BEGIN_EVENT:h='Test suite "'+i.testSuite.name+'" started.';g="info";break;case this.TEST_SUITE_COMPLETE_EVENT:h=f.Lang.sub('Test suite "'+i.testSuite.name+'" completed'+".\n"+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",i.results);g="info";break;case this.TEST_CASE_BEGIN_EVENT:h='Test case "'+i.testCase.name+'" started.';g="info";break;case this.TEST_CASE_COMPLETE_EVENT:h=f.Lang.sub('Test case "'+i.testCase.name+'" completed.\n'+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",i.results);g="info";break;default:h="Unexpected event "+i.type;h="info";}if(f.Test.Runner._log){f.log(h,g,"TestRunner");}};var c,b;for(c in f.Test.Runner){b=f.Test.Runner[c];if(c.indexOf("_EVENT")>-1){f.Test.Runner.subscribe(b,d);}}}},"@VERSION@",{"requires":["event-simulate","event-custom","json-stringify"]});