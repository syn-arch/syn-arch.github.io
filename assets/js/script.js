$(function(){

		$('.slider').slick({
			dots:true,
			infinite:true,
			autoplay:true,
			slidesToShow : 3,
			slideToScroll : 1,
			responsive : [
				{
					breakpoint:1000,
					settings : {
						slidesToShow : 2,
					}
				},
				{
					breakpoint:500,
					settings : {
						slidesToShow : 1,
					}
				}
			]
		})

		$('.testi-slider').slick({
			navs:false,
			infinite:true,
			autoplay:true,
			slidesToShow : 1,
			autoplaySpeed:3000
		})

		ScrollReveal().reveal('#profile-img', {
			origin : 'bottom',
			distance : '50px',
			delay : 0,
			easing : 'ease-in-out',
			reset:true
		} )

		ScrollReveal().reveal('#profile-name, #button-link', {
			origin : 'bottom',
			distance : '50px',
			delay : 200,
			easing : 'ease-in-out',
			reset:true
		} )

		ScrollReveal().reveal('#profile-rev, .porto, .test', {
			origin : 'bottom',
			distance : '30px',
			delay : 500,
			easing : 'ease-in-out',
			reset:true
		} )

		ScrollReveal().reveal('#skill-title, #profile-title, #contact-title, #profile-title', {
			origin : 'bottom',
			distance : '30px',
			delay : 300,
			easing : 'ease-in-out',
			reset:true
		} )


		ScrollReveal().reveal('.left-rev', {
			origin : 'left',
			distance : '50px',
			delay : 300,
			easing : 'ease-in-out',
			reset:true,
			duration : 1000
		} )

		ScrollReveal().reveal('.bottom-rev', {
			origin : 'bottom',
			distance : '50px',
			delay : 300,
			easing : 'ease-in-out',
			reset:true,
			duration : 1000
		} )


		// smooth scroll
		 $("a").on('click', function(event) {

	        // Make sure this.hash has a value before overriding default behavior
	        if (this.hash !== "") {
	        // Prevent default anchor click behavior
	        event.preventDefault();

	        // Store hash
	        var hash = this.hash;

	        // Using jQuery's animate() method to add smooth page scroll
	        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
	        $('html, body').animate({
	            scrollTop: $(hash).offset().top - 60
	        }, 800, function(){
	    
	            // Add hash (#) to URL when done scrolling (default click behavior)
	            window.location.hash = hash - 50;
	        });

	        } // End if
   		});

		$(window).scroll(function(){

			if ($(window).scrollTop() > 70) {
				$('.navbar').addClass('bg-light shadow');
				$('.nav-link').removeClass('text-white');
				$('.diaz').removeClass('text-white');
				$('.bar').removeClass('text-white');
			}else{
				$('.navbar').removeClass('bg-light shadow');
				$('.nav-link').addClass('text-white');
				$('.diaz').addClass('text-white');
				$('.bar').addClass('text-white');
			}

		})


	})