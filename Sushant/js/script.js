!function(e){var o={};function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var i in e)t.d(n,i,function(o){return e[o]}.bind(null,i));return n},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="/",t(t.s=0)}([function(e,o,t){t(1),e.exports=t(6)},function(e,o){var t=window.jQuery;t(document).ready((function(){function e(){window.shouldHidePopup&&t("#profile-tooltip").hide()}function o(e){e.matches?window.deviceSize="large":window.deviceSize="small"}window.deviceSize="small",t("#MessagesContainer").niceScroll({}),t(document).on("click","#ConversationDetailsOpener",(function(){t("#ConversationDetails").toggleClass("display-none-min-screen")})),t(document).on("click",(function(e){var o=t("#ConversationDetails"),n=t("#ConversationDetailsOpener");o.is(e.target)||n.is(e.target)||0!==o.has(e.target).length||0!==n.has(e.target).length||o.addClass("display-none-min-screen")})),t(document).on("click","#searchIcon",(function(){t("#searchForm").toggle()})),t(document).on("click","#searchButton",(function(e){e.preventDefault(),t(this).parent().parent().find(".search-results").toggle()})),t(document).on("focus","#searchInput",(function(){t(this).parent().find(".search-results").show()})),t(document).mouseup((function(e){var o=t(".search-results"),n=t("#searchInput");o.is(e.target)||n.is(e.target)||0!==o.has(e.target).length||o.hide()})),window.shouldHidePopup=!0,window.shouldShowPopup=!0,t(document).on("mouseenter","[popover-profileInfo]",(function(e){$this=t(this),window.shouldShowPopup=!0,setTimeout((function(){window.shouldShowPopup&&($pid=$this.attr("popover-profileInfo"),$tooltip=t("#profile-tooltip"),Popper.createPopper($this[0],$tooltip[0],{placement:"bottom-start"}),$tooltip.show())}),100)})),t(document).on("mouseleave","[popover-profileInfo]",(function(o){window.shouldShowPopup=!1,setTimeout((function(){e()}),100)})),t(document).on("mouseenter","#profile-tooltip",(function(e){window.shouldHidePopup=!1})),t(document).on("mouseleave","#profile-tooltip",(function(o){window.shouldHidePopup=!0,e()})),t(document).on("click","[click-profileInfo]",(function(e){$this=t(this),window.shouldShowPopup=!0,$pid=$this.attr("click-profileInfo"),$tooltip=t("#click-tooltip"),Popper.createPopper($this[0],$tooltip[0],{placement:"large"==window.deviceSize?"right":"bottom-start"}),$tooltip.show()})),t(document).mouseup((function(e){var o=t("#click-tooltip"),n=t("[click-profileInfo]");o.is(e.target)||n.is(e.target)||0!==o.has(e.target).length||o.hide()}));var n=window.matchMedia("(min-width: 768px)");o(n),n.addListener(o),"large"==window.deviceSize&&t("#Conversations").niceScroll({})}))},,,,,function(e,o){}]);
//# sourceMappingURL=script.js.map