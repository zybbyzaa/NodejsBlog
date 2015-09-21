$(document).ready(function() {
	$(".sidebar-btn").click(function(event) {
		/* Act on the event */
		if($(".sidebar-btn").hasClass('close-side'))
		{
			$(".sidebar").animate({left: "-200px"}, function() {
				/* stuff to do after animation is complete */
				$(".sidebar-btn").removeClass('close-side');
			});
		}
		else
		{
			$(".sidebar").animate({left: 0}, function() {
				/* stuff to do after animation is complete */
				$(".sidebar-btn").addClass('close-side');
			});
		}
	});
	$("#icon").change(function(event) {
		/* Act on the event */
		var num = $(this).children('option:selected').val(); 
		console.log("uploads/icon/default" + num + ".jpg");
		$("#img-icon").attr('src', 'uploads/icon/default' + num + '.jpg');
	});
	$('.chat-box-item-bottom').delegate('a', 'click', function(e) { 
		e.preventDefault();
		$("input[name=replyId]").val($(this).attr('href'));
		$("textarea[name=content]").focus();
		$("input[type=submit]").val("回复");
	}); 
	function nav_light() {
		var url = document.URL;
		if(/article/.test(url)) {
			$(".menu>li").eq(1).addClass('nav-current').siblings().removeClass('nav-current');
		}
		else if(/album/.test(url)) {
			$(".menu>li").eq(2).addClass('nav-current').siblings().removeClass('nav-current');
		}
		else if(/chat/.test(url)) {
			$(".menu>li").eq(3).addClass('nav-current').siblings().removeClass('nav-current');
		}
		else if(/about/.test(url)) {
			$(".menu>li").eq(4).addClass('nav-current').siblings().removeClass('nav-current');
		}
		else {
			$(".menu>li").eq(0).addClass('nav-current').siblings().removeClass('nav-current');
		}
	}
	nav_light();
});