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
});