!function(e){var o={};function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var i in e)t.d(n,i,function(o){return e[o]}.bind(null,i));return n},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="/",t(t.s=2)}([,,function(e,o,t){e.exports=t(3)},function(e,o){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var n=window.jQuery;function i(e){return"object"==t(e)?e:(e=e.replace(/\'/gi,'"'),JSON.parse(e))}n(document).ready((function(){window.deviceSize="small",window.$tabs=new MessageTabs({name:"Mumbai - 230532",image:"images/man_avatar1.jpg",room_id:1},{onActivateTab:function(e){n("#MessagesContainer").find(".to_me").each((function(o,t){n(t).find(".name a").text(e.name)})),n("#click-tooltip").hide(),n("#profile-tooltip").hide()}});for(var e=0;e<4;e++)$tabs.addTab({name:"Tab "+e,image:"images/man_avatar1.jpg",room_id:"test-tab-"+e});function o(){window.shouldHidePopup&&n("#profile-tooltip").hide()}function t(e){e.matches?window.deviceSize="large":window.deviceSize="small"}$tabs.onScrolledToTop=function(e){n("#MessagesContainer").prepend("<center>"+e.room_id+" onScrollTop event occured</center>")},n(document).on("click","#SendMessageButton",(function(e){$tabs.clearCurrentTabInput()})),n(document).on("click","#click-tooltip .send-message, #profile-tooltip .send-message",(function(e){e.preventDefault();var o=i(n(this).attr("data-room"));$tabs.addTab(o)})),n(document).on("click",".send-message-dropdown",(function(e){e.preventDefault();var o=i(n(this).parent().parent().parent().parent().parent().attr("click-profileInfo"));$tabs.addTab(o)})),n(document).on("click",".close-button",(function(e){e.preventDefault();var o=n(this).data("close");$tabs.closeTab(o)})),n(document).on("click",".person-header-tabbed .tab",(function(e){e.preventDefault();var o=n(this).data("index");$close=n(this).find(".close-button"),"fa fa-times"!=e.target.classList.value&&"btn close-button"!=e.target.classList.value&&$tabs.activateTab(o)})),n(document).on("click","#ConversationDetailsOpener, #DetailsOpenerBars",(function(){console.log("opener clicked"),n("#ConversationDetails").removeClass("display-none-min-screen"),n(".black-overlay").show()})),n(document).on("click","#CloserOverlay",(function(e){n("#ConversationDetails").addClass("display-none-min-screen"),n(".black-overlay").hide()})),n(document).on("click","#CloseDetails",(function(e){e.preventDefault(),n("#ConversationDetails").addClass("display-none-min-screen"),n(".black-overlay").hide()})),n(document).on("click","#searchIcon",(function(){n("#searchForm").toggle()})),n(document).on("click","#searchButton",(function(e){e.preventDefault(),n(this).parent().parent().find(".search-results").toggle()})),n(document).on("focus","#searchInput",(function(){n(this).parent().find(".search-results").show()})),n(document).mouseup((function(e){var o=n(".search-results"),t=n("#searchInput");o.is(e.target)||t.is(e.target)||0!==o.has(e.target).length||o.hide()})),window.shouldHidePopup=!0,window.shouldShowPopup=!0,n(document).on("mouseenter","[popover-profileInfo]",(function(e){$this=n(this),window.shouldShowPopup=!0,setTimeout((function(){if(window.shouldShowPopup){$pid=$this.attr("popover-profileInfo");var e=i($pid),o=n("#profile-tooltip");o.find(".header .name").text(e.name),o.find(".actions .send-message").attr("data-room",$pid);var t=o.find(".header .yes-image"),a=o.find(".header .no-image");"null"!=e.image?(t.removeClass("display-none"),a.addClass("display-none"),t.attr("src",e.image)):(t.addClass("display-none"),a.removeClass("display-none"),a.text(e.name.slice(0,1)),null!=e.color&&null!=e.color&&a.css("background","#"+e.color)),$tooltip=n("#profile-tooltip"),Popper.createPopper($this[0],$tooltip[0],{placement:"bottom-start"}),$tooltip.show()}}),100)})),n(document).on("mouseleave","[popover-profileInfo]",(function(e){window.shouldShowPopup=!1,setTimeout((function(){o()}),100)})),n(document).on("mouseenter","#profile-tooltip",(function(e){window.shouldHidePopup=!1})),n(document).on("mouseleave","#profile-tooltip",(function(e){window.shouldHidePopup=!0,o()})),n(document).on("click","[click-profileInfo]",(function(e){var o=n(this);if("large"===window.deviceSize&&(window.shouldShowPopup=!0,"dropdown-item"!==e.target.classList[0]&&"dropdown-menu"!==e.target.classList[0])){var t=o.attr("click-profileInfo"),a=i(t),r=n("#click-tooltip");r.find(".header .name").text(a.name),r.find(".actions .send-message").attr("data-room",t);var l=r.find(".header .yes-image"),s=r.find(".header .no-image");"null"!=a.image?(l.removeClass("display-none"),s.addClass("display-none"),l.attr("src",a.image)):(l.addClass("display-none"),s.removeClass("display-none"),s.text(a.name.slice(0,1)),null!=a.color&&null!=a.color&&s.css("background","#"+a.color)),$tooltip=n("#click-tooltip"),Popper.createPopper(o[0],$tooltip[0],{placement:"large"==window.deviceSize?"right":"bottom-start"}),$tooltip.show()}})),n(document).mouseup((function(e){var o=n("#click-tooltip"),t=n("[click-profileInfo]");o.is(e.target)||t.is(e.target)||0!==o.has(e.target).length||o.hide()}));var a=window.matchMedia("(min-width: 768px)");t(a),a.addListener(t),"large"==window.deviceSize&&(n("#Conversations").niceScroll({}),n(".person-header-tabbed").niceScroll({}),n("#MessagesContainer").niceScroll({}))}))}]);
//# sourceMappingURL=script.js.map