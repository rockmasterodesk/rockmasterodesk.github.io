!function(t){var n={};function o(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=t,o.c=n,o.d=function(t,n,e){o.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,n){if(1&n&&(t=o(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(o.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)o.d(e,a,function(n){return t[n]}.bind(null,a));return e},o.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(n,"a",n),n},o.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},o.p="/",o(o.s=0)}([function(t,n,o){o(1),t.exports=o(2)},function(t,n){$(document).ready((function(){$(document).on("click",'a[href="#"]',(function(t){t.preventDefault()})),$(document).on("click",".upvote-button",(function(t){$(this).hasClass("is-upvoted")?$(this).find("i").removeClass("fas").addClass("far"):$(this).find("i").removeClass("far").addClass("fas"),$(this).toggleClass("is-upvoted")}));var t=$("#HeaderChannels").children(),n=$("#HeaderChannels").attr("data-show_maximum");function o(){window.shouldHidePopup&&$("#profile-tooltip").hide()}t.length<=n?$("#HeaderChannels").find(".see-more").hide():t.each((function(t,o){t>=n&&!$(o).hasClass("see-more")&&$(o).hide()})),$("#HeaderChannels > a.see-more").on("click",(function(){$("#HeaderChannels > a:not(.see-more)").show(),$("#HeaderChannels > a.see-more").hide()})),$(document).on("click",".comment-button",(function(t){$(this).parent().parent().find("#comment_input").focus()})),$(document).on("click",".edit-post-option",(function(t){var n=$(this).parent().parent().parent().parent().parent().find(".post-body").text().trim();$("#EditPost").find("#post_edit_content").val(n),$("#EditPost").modal("show")})),$(document).on("click","#EditPost .btn-submit",(function(t){t.preventDefault(),$("#EditPost").modal("hide")})),$(document).on("click",".post-images .single-image",(function(t){var n;n=$(this).find("img").attr("src"),$("#ImageDisplayModal").find(".image-container > img").attr("src",n),$("#ImageDisplayModal").modal("show")})),$(window).on("scroll",(function(){$(this).scrollTop()>50?$("#backToTop").fadeIn("slow"):$("#backToTop").fadeOut("slow")})),$("#backToTop").on("click",(function(){return $("html, body").animate({scrollTop:0},500),!1})),$(document).on("click",".comments-count",(function(t){t.preventDefault(),$(this).parent().find(".nested-comments").show(),$(this).hide()})),void 0!==window.posts&&window.posts.length>0&&window.posts.forEach((function(t){var n='\n\t<div class="single-post bg-white">\n\t\t<div class="post-header">\n\t\t\t<div class="post-information flex-grow-1">\n\t\t\t\t<div class="post-title">\n\t\t\t\t\t<a href="PostSingle.html"><h4>'.concat(t.post_title,'</h4></a>\n\t\t\t\t</div>\n\t\t\t\t<div class="name-and-badges">\n\t\t\t\t\t<div class="name-box">\n\t\t\t\t\t\t<span>Posted in </span>\n\t\t\t\t\t\t<a href="#" class="mr-1">\n\t\t\t\t\t\t\t<span class="post-location">').concat(t.location,'</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span>by</span>\n\t\t\t\t\t\t<a href="#">\n\t\t\t\t\t\t\t<img class="post-user-img" src="').concat(t.user_image,'" alt="DP" />\n\t\t\t\t\t\t\t<span class="post-user-name">').concat(t.user_name,'</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span class="badge badge-primary bg-greenish">text</span>\n\t\t\t\t\t\t<span class="badge color-yellowish" title="A medal text"><i class="fas fa-medal"></i></span>\n\t\t\t\t\t\t<span class="time">\n\t\t\t\t\t\t\t<a href="#">').concat(t.post_time,'</a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="upvote-downvote">\n\t\t\t\t<div class="upvote-box">\n\t\t\t\t\t<i class="').concat(t.post_is_upvoted?"fas":"far",' fa-arrow-alt-circle-up"></i>\n\t\t\t\t</div>\n\t\t\t\t<div class="votes-count mx-2">\n\t\t\t\t\t').concat(t.post_votes_count,'\n\t\t\t\t</div>\n\t\t\t\t<div class="downvote-box">\n\t\t\t\t\t<i class="').concat(t.post_is_downvoted?"fas":"far",' fa-arrow-alt-circle-down"></i>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="post-body">\n\t\t\t').concat(t.post_content,'\n\t\t</div>\n\t\t<div class="post-images">\n\t\t\t').concat(t.post_images.length>0?'\n\t\t\t\t<div class="single-image">\n\t\t\t\t\t<img src="'.concat(t.post_images[0].image_url,'" alt="Post Image" />\n\t\t\t\t\t<div class="overlay"></div>\n\t\t\t\t</div>\n\t\t\t'):"",'\n\t\t</div>\n\t\t<div class="post-options bordered-bottom bordered-top">\n\t\t\t<a href="PostSingle.html" class="btn btn-default btn-option">\n\t\t\t\t<i class="far fa-comment-alt"></i>\n\t\t\t\t').concat(t.post_comments_count,'\n\t\t\t</a>\n\t\t\t<div class="dropdown display-inline-block">\n\t\t\t\t<button class="btn btn-option dropdown" type="button" id="postShareMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n\t\t\t\t\t<i class="fas fa-share"></i>\n\t\t\t\t\tShare\n\t\t\t\t</button>\n\t\t\t\t<div class="dropdown-menu" aria-labelledby="postShareMenu">\n\t\t\t\t\t<a class="dropdown-item" href="#"><i class="fas fa-link"></i>Copy Link</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="dropdown display-inline-block">\n\t\t\t\t<button class="btn btn-option dropdown" type="button" id="postOptionsMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n\t\t\t\t\t<i class="fas fa-ellipsis-h"></i>\n\t\t\t\t</button>\n\t\t\t\t<div class="dropdown-menu" aria-labelledby="postOptionsMenu">\n\t\t\t\t\t<a class="dropdown-item edit-post-option" href="#"><i class="fas fa-edit"></i>Edit</a>\n\t\t\t\t\t<a class="dropdown-item" href="#"><i class="fas fa-ban"></i>Hide</a>\n\t\t\t\t\t<a class="dropdown-item" href="#"><i class="fas fa-flag"></i>Report</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\t\t');$(".the-posts").append(n)})),window.shouldHidePopup=!0,window.shouldShowPopup=!0,$(document).on("mouseenter","[popover-profileInfo]",(function(t){$this=$(this),window.shouldShowPopup=!0,setTimeout((function(){if(window.shouldShowPopup){$pid=$this.attr("popover-profileInfo");var t=getRoomObject($pid),n=$("#profile-tooltip");n.find(".header .name").text(t.name),n.find(".actions .send-message").attr("data-room",$pid),t.self?(n.find(".actions button").each((function(){$(this).hide()})),n.find(".actions .myProfile").show()):(n.find(".actions button").each((function(){$(this).show()})),n.find(".actions .myProfile").hide());var o=n.find(".header .yes-image"),e=n.find(".header .no-image");"null"!=t.image?(o.removeClass("display-none"),e.addClass("display-none"),o.attr("src",t.image)):(o.addClass("display-none"),e.removeClass("display-none"),e.text(t.name.slice(0,1)),null!=t.color&&null!=t.color&&e.css("background","#"+t.color)),$tooltip=$("#profile-tooltip"),Popper.createPopper($this[0],$tooltip[0],{placement:"bottom-start"}),$tooltip.show()}}),100)})),$(document).on("mouseleave","[popover-profileInfo]",(function(t){window.shouldShowPopup=!1,setTimeout((function(){o()}),100)})),$(document).on("mouseenter","#profile-tooltip",(function(t){window.shouldHidePopup=!1})),$(document).on("mouseleave","#profile-tooltip",(function(t){window.shouldHidePopup=!0,o()}))}))},function(t,n){}]);
//# sourceMappingURL=posts.js.map