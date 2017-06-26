$(function(){
	$(".lf_one ul li.qiye").click(function(){
		$(".lf_one ul li.qiye").removeClass("bg color");
		$(this).addClass("bg color");
	});

	//切换页面
	$('.details_in').click(function(){
		$('.business').css('display','none');
		$('.lf_two').css('display','block');
	});

	$('.litigation_in').click(function(){
		$('.business').css('display','none');
		$('.litigation').css('display','block');
	});

	$('.investment_in').click(function(){
		$('.business').css('display','none');
		$('.investment').css('display','block');
	});

	$('.report_in').click(function(){
		$('.business').css('display','none');
		$('.report').css('display','block');
	});

	$('.information_in').click(function(){
		$('.business').css('display','none');
		$('.information').css('display','block');
	});
});