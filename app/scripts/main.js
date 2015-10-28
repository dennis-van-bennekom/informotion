$('document').ready(function () {
	$('.menu-button').click(function () {
		if ($('.body').hasClass('menu-open')) {
			$('.body').removeClass('menu-open');

		} else {
			$('.body').addClass('menu-open');
		}
	});

	$('#main-wrapper').smoothState({ 
		debug: true
	});

});