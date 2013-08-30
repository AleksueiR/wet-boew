/*!
* MediaElement.js
* HTML5 <video> and <audio> shim and player
* http://mediaelementjs.com/
*
* Creates a JavaScript object that mimics HTML5 MediaElement API
* for browsers that don't understand HTML5 or can't play the provided codec
* Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
*
* Copyright 2010-2013, John Dyer (http://j.hn)
* License: MIT
*
*/
var mejs=mejs||{};mejs.version="2.13.0";mejs.meIndex=0;mejs.plugins={silverlight:[{version:[3,0],types:["video/mp4","video/m4v","video/mov","video/wmv","audio/wma","audio/m4a","audio/mp3","audio/wav","audio/mpeg"]}],flash:[{version:[9,0,124],types:["video/mp4","video/m4v","video/mov","video/flv","video/rtmp","video/x-flv","audio/flv","audio/x-flv","audio/mp3","audio/m4a","audio/mpeg","video/youtube","video/x-youtube"]}],youtube:[{version:null,types:["video/youtube","video/x-youtube","audio/youtube","audio/x-youtube"]}],vimeo:[{version:null,types:["video/vimeo","video/x-vimeo"]}]};mejs.Utility={encodeUrl:function(a){return encodeURIComponent(a)},escapeHTML:function(a){return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")},absolutizeUrl:function(a){var b=document.createElement("div");b.innerHTML='<a href="'+this.escapeHTML(a)+'">x</a>';return b.firstChild.href},getScriptPath:function(o){var l=0,g,m="",c="",h,e,b,a,d,f=document.getElementsByTagName("script"),n=f.length,k=o.length;for(;l<n;l++){b=f[l].src;h=b.lastIndexOf("/");if(h>-1){d=b.substring(h+1);a=b.substring(0,h+1)}else{d=b;a=""}for(g=0;g<k;g++){c=o[g];e=d.indexOf(c);if(e>-1){m=a;break}}if(m!==""){break}}return m},secondsToTimeCode:function(c,g,a,b){if(typeof a=="undefined"){a=false}else{if(typeof b=="undefined"){b=25}}var f=Math.floor(c/3600)%24,d=Math.floor(c/60)%60,h=Math.floor(c%60),e=Math.floor(((c%1)*b).toFixed(3)),j=((g||f>0)?(f<10?"0"+f:f)+":":"")+(d<10?"0"+d:d)+":"+(h<10?"0"+h:h)+((a)?":"+(e<10?"0"+e:e):"");return j},timeCodeToSeconds:function(c,k,d,e){if(typeof d=="undefined"){d=false}else{if(typeof e=="undefined"){e=25}}var f=c.split(":"),a=parseInt(f[0],10),b=parseInt(f[1],10),h=parseInt(f[2],10),j=0,g=0;if(d){j=parseInt(f[3])/e}g=(a*3600)+(b*60)+h+j;return g},convertSMPTEtoSeconds:function(a){if(typeof a!="string"){return false}a=a.replace(",",".");var d=0,b=(a.indexOf(".")!=-1)?a.split(".")[1].length:0,e=1;a=a.split(":").reverse();for(var c=0;c<a.length;c++){e=1;if(c>0){e=Math.pow(60,c)}d+=Number(a[c])*e}return Number(d.toFixed(b))},removeSwf:function(b){var a=document.getElementById(b);if(a&&/object|embed/i.test(a.nodeName)){if(mejs.MediaFeatures.isIE){a.style.display="none";(function(){if(a.readyState==4){mejs.Utility.removeObjectInIE(b)}else{setTimeout(arguments.callee,10)}})()}else{a.parentNode.removeChild(a)}}},removeObjectInIE:function(c){var b=document.getElementById(c);if(b){for(var a in b){if(typeof b[a]=="function"){b[a]=null}}b.parentNode.removeChild(b)}}};mejs.PluginDetector={hasPluginVersion:function(c,a){var b=this.plugins[c];a[1]=a[1]||0;a[2]=a[2]||0;return(b[0]>a[0]||(b[0]==a[0]&&b[1]>a[1])||(b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]))?true:false},nav:window.navigator,ua:window.navigator.userAgent.toLowerCase(),plugins:[],addPlugin:function(d,c,e,a,b){this.plugins[d]=this.detectPlugin(c,e,a,b)},detectPlugin:function(g,b,c,k){var h=[0,0,0],j,d,a;if(typeof(this.nav.plugins)!="undefined"&&typeof this.nav.plugins[g]=="object"){j=this.nav.plugins[g].description;if(j&&!(typeof this.nav.mimeTypes!="undefined"&&this.nav.mimeTypes[b]&&!this.nav.mimeTypes[b].enabledPlugin)){h=j.replace(g,"").replace(/^\s+/,"").replace(/\sr/gi,".").split(".");for(d=0;d<h.length;d++){h[d]=parseInt(h[d].match(/\d+/),10)}}}else{if(typeof(window.ActiveXObject)!="undefined"){try{a=new ActiveXObject(c);if(a){h=k(a)}}catch(f){}}}return h}};mejs.PluginDetector.addPlugin("flash","Shockwave Flash","application/x-shockwave-flash","ShockwaveFlash.ShockwaveFlash",function(b){var a=[],c=b.GetVariable("$version");if(c){c=c.split(" ")[1].split(",");a=[parseInt(c[0],10),parseInt(c[1],10),parseInt(c[2],10)]}return a});mejs.PluginDetector.addPlugin("silverlight","Silverlight Plug-In","application/x-silverlight-2","AgControl.AgControl",function(b){var a=[0,0,0,0],c=function(f,d,e,g){while(f.isVersionSupported(d[0]+"."+d[1]+"."+d[2]+"."+d[3])){d[e]+=g}d[e]-=g};c(b,a,0,1);c(b,a,1,1);c(b,a,2,10000);c(b,a,2,1000);c(b,a,2,100);c(b,a,2,10);c(b,a,2,1);c(b,a,3,1);return a});mejs.MediaFeatures={init:function(){var f=this,k=document,j=mejs.PluginDetector.nav,c=mejs.PluginDetector.ua.toLowerCase(),b,a,g=["source","track","audio","video"];f.isiPad=(c.match(/ipad/i)!==null);f.isiPhone=(c.match(/iphone/i)!==null);f.isiOS=f.isiPhone||f.isiPad;f.isAndroid=(c.match(/android/i)!==null);f.isBustedAndroid=(c.match(/android 2\.[12]/)!==null);f.isBustedNativeHTTPS=(location.protocol==="https:"&&(c.match(/android [12]\./)!==null||c.match(/macintosh.* version.* safari/)!==null));f.isIE=(j.appName.toLowerCase().indexOf("microsoft")!=-1);f.isChrome=(c.match(/chrome/gi)!==null);f.isFirefox=(c.match(/firefox/gi)!==null);f.isWebkit=(c.match(/webkit/gi)!==null);f.isGecko=(c.match(/gecko/gi)!==null)&&!f.isWebkit;f.isOpera=(c.match(/opera/gi)!==null);f.hasTouch=("ontouchstart" in window&&window.ontouchstart!=null);f.svg=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect;for(b=0;b<g.length;b++){a=document.createElement(g[b])}f.supportsMediaTag=(typeof a.canPlayType!=="undefined"||f.isBustedAndroid);try{a.canPlayType("video/mp4")}catch(h){f.supportsMediaTag=false}f.hasSemiNativeFullScreen=(typeof a.webkitEnterFullscreen!=="undefined");f.hasWebkitNativeFullScreen=(typeof a.webkitRequestFullScreen!=="undefined");f.hasMozNativeFullScreen=(typeof a.mozRequestFullScreen!=="undefined");f.hasTrueNativeFullScreen=(f.hasWebkitNativeFullScreen||f.hasMozNativeFullScreen);f.nativeFullScreenEnabled=f.hasTrueNativeFullScreen;if(f.hasMozNativeFullScreen){f.nativeFullScreenEnabled=a.mozFullScreenEnabled}if(this.isChrome){f.hasSemiNativeFullScreen=false}if(f.hasTrueNativeFullScreen){f.fullScreenEventName=(f.hasWebkitNativeFullScreen)?"webkitfullscreenchange":"mozfullscreenchange";f.isFullScreen=function(){if(a.mozRequestFullScreen){return k.mozFullScreen}else{if(a.webkitRequestFullScreen){return k.webkitIsFullScreen}}};f.requestFullScreen=function(d){if(f.hasWebkitNativeFullScreen){d.webkitRequestFullScreen()}else{if(f.hasMozNativeFullScreen){d.mozRequestFullScreen()}}};f.cancelFullScreen=function(){if(f.hasWebkitNativeFullScreen){document.webkitCancelFullScreen()}else{if(f.hasMozNativeFullScreen){document.mozCancelFullScreen()}}}}if(f.hasSemiNativeFullScreen&&c.match(/mac os x 10_5/i)){f.hasNativeFullScreen=false;f.hasSemiNativeFullScreen=false}}};mejs.MediaFeatures.init();mejs.HtmlMediaElement={pluginType:"native",isFullScreen:false,setCurrentTime:function(a){this.currentTime=a},setMuted:function(a){this.muted=a},setVolume:function(a){this.volume=a},stop:function(){this.pause()},setSrc:function(a){var c=this.getElementsByTagName("source");while(c.length>0){this.removeChild(c[0])}if(typeof a=="string"){this.src=a}else{var b,d;for(b=0;b<a.length;b++){d=a[b];if(this.canPlayType(d.type)){this.src=d.src;break}}}},setVideoSize:function(b,a){this.width=b;this.height=a}};mejs.PluginMediaElement=function(b,c,a){this.id=b;this.pluginType=c;this.src=a;this.events={};this.attributes={}};mejs.PluginMediaElement.prototype={pluginElement:null,pluginType:"",isFullScreen:false,playbackRate:-1,defaultPlaybackRate:-1,seekable:[],played:[],paused:true,ended:false,seeking:false,duration:0,error:null,tagName:"",muted:false,volume:1,currentTime:0,play:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.playVideo()}else{this.pluginApi.playMedia()}this.paused=false}},load:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){}else{this.pluginApi.loadMedia()}this.paused=false}},pause:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.pauseVideo()}else{this.pluginApi.pauseMedia()}this.paused=true}},stop:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.stopVideo()}else{this.pluginApi.stopMedia()}this.paused=true}},canPlayType:function(e){var d,c,a,b=mejs.plugins[this.pluginType];for(d=0;d<b.length;d++){a=b[d];if(mejs.PluginDetector.hasPluginVersion(this.pluginType,a.version)){for(c=0;c<a.types.length;c++){if(e==a.types[c]){return"probably"}}}}return""},positionFullscreenButton:function(a,c,b){if(this.pluginApi!=null&&this.pluginApi.positionFullscreenButton){this.pluginApi.positionFullscreenButton(Math.floor(a),Math.floor(c),b)}},hideFullscreenButton:function(){if(this.pluginApi!=null&&this.pluginApi.hideFullscreenButton){this.pluginApi.hideFullscreenButton()}},setSrc:function(a){if(typeof a=="string"){this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a));this.src=mejs.Utility.absolutizeUrl(a)}else{var b,c;for(b=0;b<a.length;b++){c=a[b];if(this.canPlayType(c.type)){this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src));this.src=mejs.Utility.absolutizeUrl(a);break}}}},setCurrentTime:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.seekTo(a)}else{this.pluginApi.setCurrentTime(a)}this.currentTime=a}},setVolume:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.setVolume(a*100)}else{this.pluginApi.setVolume(a)}this.volume=a}},setMuted:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){if(a){this.pluginApi.mute()}else{this.pluginApi.unMute()}this.muted=a;this.dispatchEvent("volumechange")}else{this.pluginApi.setMuted(a)}this.muted=a}},setVideoSize:function(b,a){if(this.pluginElement.style){this.pluginElement.style.width=b+"px";this.pluginElement.style.height=a+"px"}if(this.pluginApi!=null&&this.pluginApi.setVideoSize){this.pluginApi.setVideoSize(b,a)}},setFullscreen:function(a){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.pluginApi.setFullscreen(a)}},enterFullScreen:function(){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.setFullscreen(true)}},exitFullScreen:function(){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.setFullscreen(false)}},addEventListener:function(b,c,a){this.events[b]=this.events[b]||[];this.events[b].push(c)},removeEventListener:function(a,c){if(!a){this.events={};return true}var b=this.events[a];if(!b){return true}if(!c){this.events[a]=[];return true}for(i=0;i<b.length;i++){if(b[i]===c){this.events[a].splice(i,1);return true}}return false},dispatchEvent:function(a){var c,b,d=this.events[a];if(d){b=Array.prototype.slice.call(arguments,1);for(c=0;c<d.length;c++){d[c].apply(null,b)}}},hasAttribute:function(a){return(a in this.attributes)},removeAttribute:function(a){delete this.attributes[a]},getAttribute:function(a){if(this.hasAttribute(a)){return this.attributes[a]}return""},setAttribute:function(a,b){this.attributes[a]=b},remove:function(){mejs.Utility.removeSwf(this.pluginElement.id);mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id)}};mejs.MediaPluginBridge={pluginMediaElements:{},htmlMediaElements:{},registerPluginElement:function(c,a,b){this.pluginMediaElements[c]=a;this.htmlMediaElements[c]=b},unregisterPluginElement:function(a){delete this.pluginMediaElements[a];delete this.htmlMediaElements[a]},initPlugin:function(c){var a=this.pluginMediaElements[c],b=this.htmlMediaElements[c];if(a){switch(a.pluginType){case"flash":a.pluginElement=a.pluginApi=document.getElementById(c);break;case"silverlight":a.pluginElement=document.getElementById(a.id);a.pluginApi=a.pluginElement.Content.MediaElementJS;break}if(a.pluginApi!=null&&a.success){a.success(a,b)}}},fireEvent:function(h,c,b){var g,f,a,d=this.pluginMediaElements[h];if(!d){return}g={type:c,target:d};for(f in b){d[f]=b[f];g[f]=b[f]}a=b.bufferedTime||0;g.target.buffered=g.buffered={start:function(e){return 0},end:function(e){return a},length:1};d.dispatchEvent(g.type,g)}};mejs.MediaElementDefaults={mode:"auto",plugins:["flash","silverlight","youtube","vimeo"],enablePluginDebug:false,httpsBasicAuthSite:false,type:"",pluginPath:mejs.Utility.getScriptPath(["mediaelement.js","mediaelement.min.js","mediaelement-and-player.js","mediaelement-and-player.min.js"]),flashName:"flashmediaelement.swf",flashStreamer:"",enablePluginSmoothing:false,enablePseudoStreaming:false,pseudoStreamingStartQueryParam:"start",silverlightName:"silverlightmediaelement.xap",defaultVideoWidth:480,defaultVideoHeight:270,pluginWidth:-1,pluginHeight:-1,pluginVars:[],timerRate:250,startVolume:0.8,success:function(){},error:function(){}};mejs.MediaElement=function(a,b){return mejs.HtmlMediaElementShim.create(a,b)};mejs.HtmlMediaElementShim={create:function(e,d){var n=mejs.MediaElementDefaults,k=(typeof(e)=="string")?document.getElementById(e):e,h=k.tagName.toLowerCase(),g=(h==="audio"||h==="video"),b=(g)?k.getAttribute("src"):k.getAttribute("href"),l=k.getAttribute("poster"),f=k.getAttribute("autoplay"),j=k.getAttribute("preload"),m=k.getAttribute("controls"),a,c;for(c in d){n[c]=d[c]}b=(typeof b=="undefined"||b===null||b=="")?null:b;l=(typeof l=="undefined"||l===null)?"":l;j=(typeof j=="undefined"||j===null||j==="false")?"none":j;f=!(typeof f=="undefined"||f===null||f==="false");m=!(typeof m=="undefined"||m===null||m==="false");a=this.determinePlayback(k,n,mejs.MediaFeatures.supportsMediaTag,g,b);a.url=(a.url!==null)?mejs.Utility.absolutizeUrl(a.url):"";if(a.method=="native"){if(mejs.MediaFeatures.isBustedAndroid){k.src=a.url;k.addEventListener("click",function(){k.play()},false)}return this.updateNative(a,n,f,j)}else{if(a.method!==""){return this.createPlugin(a,n,l,f,j,m)}else{this.createErrorMessage(a,n,l);return this}}},determinePlayback:function(t,c,h,v,f){var o=[],s,r,q,p,m,d,g={method:"",url:"",htmlMediaElement:t,isVideo:(t.tagName.toLowerCase()!="audio")},a,b,u,w,e;if(typeof c.type!="undefined"&&c.type!==""){if(typeof c.type=="string"){o.push({type:c.type,url:f})}else{for(s=0;s<c.type.length;s++){o.push({type:c.type[s],url:f})}}}else{if(f!==null){d=this.formatType(f,t.getAttribute("type"));o.push({type:d,url:f})}else{for(s=0;s<t.childNodes.length;s++){m=t.childNodes[s];if(m.nodeType==1&&m.tagName.toLowerCase()=="source"){f=m.getAttribute("src");d=this.formatType(f,m.getAttribute("type"));e=m.getAttribute("media");if(!e||!window.matchMedia||(window.matchMedia&&window.matchMedia(e).matches)){o.push({type:d,url:f})}}}}}if(!v&&o.length>0&&o[0].url!==null&&this.getTypeFromFile(o[0].url).indexOf("audio")>-1){g.isVideo=false}if(mejs.MediaFeatures.isBustedAndroid){t.canPlayType=function(j){return(j.match(/video\/(mp4|m4v)/gi)!==null)?"maybe":""}}if(h&&(c.mode==="auto"||c.mode==="auto_plugin"||c.mode==="native")&&!(mejs.MediaFeatures.isBustedNativeHTTPS&&c.httpsBasicAuthSite===true)){if(!v){w=document.createElement(g.isVideo?"video":"audio");t.parentNode.insertBefore(w,t);t.style.display="none";g.htmlMediaElement=t=w}for(s=0;s<o.length;s++){if(t.canPlayType(o[s].type).replace(/no/,"")!==""||t.canPlayType(o[s].type.replace(/mp3/,"mpeg")).replace(/no/,"")!==""){g.method="native";g.url=o[s].url;break}}if(g.method==="native"){if(g.url!==null){t.src=g.url}if(c.mode!=="auto_plugin"){return g}}}if(c.mode==="auto"||c.mode==="auto_plugin"||c.mode==="shim"){for(s=0;s<o.length;s++){d=o[s].type;for(r=0;r<c.plugins.length;r++){a=c.plugins[r];b=mejs.plugins[a];for(q=0;q<b.length;q++){u=b[q];if(u.version==null||mejs.PluginDetector.hasPluginVersion(a,u.version)){for(p=0;p<u.types.length;p++){if(d==u.types[p]){g.method=a;g.url=o[s].url;return g}}}}}}}if(c.mode==="auto_plugin"&&g.method==="native"){return g}if(g.method===""&&o.length>0){g.url=o[0].url}return g},formatType:function(a,c){var b;if(a&&!c){return this.getTypeFromFile(a)}else{if(c&&~c.indexOf(";")){return c.substr(0,c.indexOf(";"))}else{return c}}},getTypeFromFile:function(a){a=a.split("?")[0];var b=a.substring(a.lastIndexOf(".")+1).toLowerCase();return(/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b)?"video":"audio")+"/"+this.getTypeFromExtension(b)},getTypeFromExtension:function(a){switch(a){case"mp4":case"m4v":return"mp4";case"webm":case"webma":case"webmv":return"webm";case"ogg":case"oga":case"ogv":return"ogg";default:return a}},createErrorMessage:function(c,b,g){var d=c.htmlMediaElement,a=document.createElement("div");a.className="me-cannotplay";try{a.style.width=d.width+"px";a.style.height=d.height+"px"}catch(f){}if(b.customError){a.innerHTML=b.customError}else{a.innerHTML=(g!=="")?'<a href="'+c.url+'"><img src="'+g+'" width="100%" height="100%" /></a>':'<a href="'+c.url+'"><span>'+mejs.i18n.t("Download File")+"</span></a>"}d.parentNode.insertBefore(a,d);d.style.display="none";b.error(d)},createPlugin:function(n,a,c,e,d,h){var r=n.htmlMediaElement,m=1,l=1,s="me_"+n.method+"_"+(mejs.meIndex++),o=new mejs.PluginMediaElement(s,n.method,n.url),g=document.createElement("div"),b,p,j;o.tagName=r.tagName;for(var q=0;q<r.attributes.length;q++){var f=r.attributes[q];if(f.specified==true){o.setAttribute(f.name,f.value)}}p=r.parentNode;while(p!==null&&p.tagName.toLowerCase()!="body"){if(p.parentNode.tagName.toLowerCase()=="p"){p.parentNode.parentNode.insertBefore(p,p.parentNode);break}p=p.parentNode}if(n.isVideo){m=(a.pluginWidth>0)?a.pluginWidth:(a.videoWidth>0)?a.videoWidth:(r.getAttribute("width")!==null)?r.getAttribute("width"):a.defaultVideoWidth;l=(a.pluginHeight>0)?a.pluginHeight:(a.videoHeight>0)?a.videoHeight:(r.getAttribute("height")!==null)?r.getAttribute("height"):a.defaultVideoHeight;m=mejs.Utility.encodeUrl(m);l=mejs.Utility.encodeUrl(l)}else{if(a.enablePluginDebug){m=320;l=240}}o.success=a.success;mejs.MediaPluginBridge.registerPluginElement(s,o,r);g.className="me-plugin";g.id=s+"_container";if(n.isVideo){r.parentNode.insertBefore(g,r)}else{document.body.insertBefore(g,document.body.childNodes[0])}j=["id="+s,"isvideo="+((n.isVideo)?"true":"false"),"autoplay="+((e)?"true":"false"),"preload="+d,"width="+m,"startvolume="+a.startVolume,"timerrate="+a.timerRate,"flashstreamer="+a.flashStreamer,"height="+l,"pseudostreamstart="+a.pseudoStreamingStartQueryParam];if(n.url!==null){if(n.method=="flash"){j.push("file="+mejs.Utility.encodeUrl(n.url))}else{j.push("file="+n.url)}}if(a.enablePluginDebug){j.push("debug=true")}if(a.enablePluginSmoothing){j.push("smoothing=true")}if(a.enablePseudoStreaming){j.push("pseudostreaming=true")}if(h){j.push("controls=true")}if(a.pluginVars){j=j.concat(a.pluginVars)}switch(n.method){case"silverlight":g.innerHTML='<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="'+s+'" name="'+s+'" width="'+m+'" height="'+l+'" class="mejs-shim"><param name="initParams" value="'+j.join(",")+'" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="'+a.pluginPath+a.silverlightName+'" /></object>';break;case"flash":if(mejs.MediaFeatures.isIE){b=document.createElement("div");g.appendChild(b);b.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+s+'" width="'+m+'" height="'+l+'" class="mejs-shim"><param name="movie" value="'+a.pluginPath+a.flashName+"?x="+(new Date())+'" /><param name="flashvars" value="'+j.join("&amp;")+'" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>'}else{g.innerHTML='<embed id="'+s+'" name="'+s+'" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="'+a.pluginPath+a.flashName+'" flashvars="'+j.join("&")+'" width="'+m+'" height="'+l+'" class="mejs-shim"></embed>'}break;case"youtube":var k=n.url.substr(n.url.lastIndexOf("=")+1);youtubeSettings={container:g,containerId:g.id,pluginMediaElement:o,pluginId:s,videoId:k,height:l,width:m};if(mejs.PluginDetector.hasPluginVersion("flash",[10,0,0])){mejs.YouTubeApi.createFlash(youtubeSettings)}else{mejs.YouTubeApi.enqueueIframe(youtubeSettings)}break;case"vimeo":o.vimeoid=n.url.substr(n.url.lastIndexOf("/")+1);g.innerHTML='<iframe src="http://player.vimeo.com/video/'+o.vimeoid+'?portrait=0&byline=0&title=0" width="'+m+'" height="'+l+'" frameborder="0" class="mejs-shim"></iframe>';break}r.style.display="none";r.removeAttribute("autoplay");return o},updateNative:function(d,c,f,b){var e=d.htmlMediaElement,a;for(a in mejs.HtmlMediaElement){e[a]=mejs.HtmlMediaElement[a]}c.success(e,e);return e}};mejs.YouTubeApi={isIframeStarted:false,isIframeLoaded:false,loadIframeApi:function(){if(!this.isIframeStarted){var a=document.createElement("script");a.src="//www.youtube.com/player_api";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);this.isIframeStarted=true}},iframeQueue:[],enqueueIframe:function(a){if(this.isLoaded){this.createIframe(a)}else{this.loadIframeApi();this.iframeQueue.push(a)}},createIframe:function(c){var b=c.pluginMediaElement,a=new YT.Player(c.containerId,{height:c.height,width:c.width,videoId:c.videoId,playerVars:{controls:0},events:{onReady:function(){c.pluginMediaElement.pluginApi=a;mejs.MediaPluginBridge.initPlugin(c.pluginId);setInterval(function(){mejs.YouTubeApi.createEvent(a,b,"timeupdate")},250)},onStateChange:function(d){mejs.YouTubeApi.handleStateChange(d.data,a,b)}}})},createEvent:function(d,c,b){var e={type:b,target:c};if(d&&d.getDuration){c.currentTime=e.currentTime=d.getCurrentTime();c.duration=e.duration=d.getDuration();e.paused=c.paused;e.ended=c.ended;e.muted=d.isMuted();e.volume=d.getVolume()/100;e.bytesTotal=d.getVideoBytesTotal();e.bufferedBytes=d.getVideoBytesLoaded();var a=e.bufferedBytes/e.bytesTotal*e.duration;e.target.buffered=e.buffered={start:function(f){return 0},end:function(f){return a},length:1}}c.dispatchEvent(e.type,e)},iFrameReady:function(){this.isLoaded=true;this.isIframeLoaded=true;while(this.iframeQueue.length>0){var a=this.iframeQueue.pop();this.createIframe(a)}},flashPlayers:{},createFlash:function(c){this.flashPlayers[c.pluginId]=c;var b,a="//www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid="+c.pluginId+"&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";if(mejs.MediaFeatures.isIE){b=document.createElement("div");c.container.appendChild(b);b.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+c.pluginId+'" width="'+c.width+'" height="'+c.height+'" class="mejs-shim"><param name="movie" value="'+a+'" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>'}else{c.container.innerHTML='<object type="application/x-shockwave-flash" id="'+c.pluginId+'" data="'+a+'" width="'+c.width+'" height="'+c.height+'" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="always"><param name="wmode" value="transparent"></object>'}},flashReady:function(e){var c=this.flashPlayers[e],b=document.getElementById(e),a=c.pluginMediaElement;a.pluginApi=a.pluginElement=b;mejs.MediaPluginBridge.initPlugin(e);b.cueVideoById(c.videoId);var d=c.containerId+"_callback";window[d]=function(f){mejs.YouTubeApi.handleStateChange(f,b,a)};b.addEventListener("onStateChange",d);setInterval(function(){mejs.YouTubeApi.createEvent(b,a,"timeupdate")},250)},handleStateChange:function(c,b,a){switch(c){case -1:a.paused=true;a.ended=true;mejs.YouTubeApi.createEvent(b,a,"loadedmetadata");break;case 0:a.paused=false;a.ended=true;mejs.YouTubeApi.createEvent(b,a,"ended");break;case 1:a.paused=false;a.ended=false;mejs.YouTubeApi.createEvent(b,a,"play");mejs.YouTubeApi.createEvent(b,a,"playing");break;case 2:a.paused=true;a.ended=false;mejs.YouTubeApi.createEvent(b,a,"pause");break;case 3:mejs.YouTubeApi.createEvent(b,a,"progress");break;case 5:break}}};function onYouTubePlayerAPIReady(){mejs.YouTubeApi.iFrameReady()}function onYouTubePlayerReady(a){mejs.YouTubeApi.flashReady(a)}window.mejs=mejs;window.MediaElement=mejs.MediaElement;
/*!
 * Adds Internationalization and localization to objects.
 *
 * What is the concept beyond i18n?
 *	 http://en.wikipedia.org/wiki/Internationalization_and_localization
 *
 *
 * This file both i18n methods and locale which is used to translate
 * strings into other languages.
 *
 * Default translations are not available, you have to add them
 * through locale objects which are named exactly as the langcode
 * they stand for. The default language is always english (en).
 *
 *
 * Wrapper built to be able to attach the i18n object to
 * other objects without changing more than one line.
 *
 *
 * LICENSE:
 *
 *	 The i18n file uses methods from the Drupal project (drupal.js):
 *	   - i18n.methods.t() (modified)
 *	   - i18n.methods.checkPlain() (full copy)
 *	   - i18n.methods.formatString() (full copy)
 *
 *	 The Drupal project is (like mediaelementjs) licensed under GPLv2.
 *	  - http://drupal.org/licensing/faq/#q1
 *	  - https://github.com/johndyer/mediaelement
 *	  - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 *
 * @author
 *	 Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *	 me-i18n-locale.js
 *
 * @params
 *	- context - document, iframe ..
 *	- exports - CommonJS, window ..
 *
 */
(function(b,a,d){var c={locale:{language:"",strings:{}},methods:{}};c.locale.getLanguage=function(){return c.locale.language||navigator.language};if(typeof mejsL10n!="undefined"){c.locale.language=mejsL10n.language}c.locale.INIT_LANGUAGE=c.locale.getLanguage();c.methods.checkPlain=function(h){var g,f,e={"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"};h=String(h);for(g in e){if(e.hasOwnProperty(g)){f=new RegExp(g,"g");h=h.replace(f,e[g])}}return h};c.methods.formatString=function(g,e){for(var f in e){switch(f.charAt(0)){case"@":e[f]=c.methods.checkPlain(e[f]);break;case"!":break;case"%":default:e[f]='<em class="placeholder">'+c.methods.checkPlain(e[f])+"</em>";break}g=g.replace(f,e[f])}return g};c.methods.t=function(g,f,e){if(c.locale.strings&&c.locale.strings[e.context]&&c.locale.strings[e.context][g]){g=c.locale.strings[e.context][g]}if(f){g=c.methods.formatString(g,f)}return g};c.t=function(g,f,e){if(typeof g==="string"&&g.length>0){var h=c.locale.getLanguage();e=e||{context:h};return c.methods.t(g,f,e)}else{throw {name:"InvalidArgumentException",message:"First argument is either not a string or empty."}}};a.i18n=c}(document,mejs));(function(a,b){if(typeof mejsL10n!="undefined"){a[mejsL10n.language]=mejsL10n.strings}}(mejs.i18n.locale.strings));
/*!
 * This is a i18n.locale language object.
 *
 *<de> German translation by Tim Latz, latz.tim@gmail.com
 *
 * @author
 *	 Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *	 me-i18n.js
 *
 * @params
 *	- exports - CommonJS, window ..
 */
(function(a,b){a.de={Fullscreen:"Vollbild","Go Fullscreen":"Vollbild an","Turn off Fullscreen":"Vollbild aus",Close:"Schließen"}}(mejs.i18n.locale.strings));
/*!
 * This is a i18n.locale language object.
 *
 *<de> Traditional chinese translation by Tim Latz, latz.tim@gmail.com
 *
 * @author
 *	 Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *	 me-i18n.js
 *
 * @params
 *	- exports - CommonJS, window ..
 */
(function(a,b){a.zh={Fullscreen:"全螢幕","Go Fullscreen":"全屏模式","Turn off Fullscreen":"退出全屏模式",Close:"關閉"}}(mejs.i18n.locale.strings));