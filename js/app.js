$(document).ready(function(){
$('.slider').slick({
    autoplay:true,
    autoplaySpeed:2000,
    arrows:false,
    dots:true,
    appendDots:'.slider-dots',
    dotsClass:'dots',
    infinite:true,
    speed:300,
    cssEase:'linear'
});




let hamberger = document.querySelector('.hamberger');
let mobileNav = document.querySelector('.mobile-nav');

function setMobileNavOpen(isOpen) {
    mobileNav.classList.toggle('open', isOpen);
    hamberger.classList.toggle('active', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    hamberger.setAttribute('aria-expanded', String(isOpen));
    hamberger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

hamberger.addEventListener('click', function(){
    setMobileNavOpen(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function(){
        setMobileNavOpen(false);
    });
});

document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMobileNavOpen(false);
    }
});

    $('.hero-slider').slick({
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        dots: false,        // ❌ No clickable dots
        fade: true,
        infinite: true,     // 🔁 Loop through slides
        speed: 800,
        cssEase: 'ease-in-out',
        pauseOnHover: false // Keeps rotating even on hover
    });



    // Initialize EmailJS
    emailjs.init('AIIFJ5WXpaw9xbEWW');
    
    // Form submission handler
    $('#contactForm').on('submit', function(e){
        e.preventDefault();
        
        const name = $('input[name="user_name"]').val();
        const email = $('input[name="user_email"]').val();
        const subject = $('input[name="subject"]').val();
        const message = $('textarea[name="message"]').val();
        
        if(!name || !email || !message || !subject){
            alert('Please fill in all required fields');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            alert('Please enter a valid email address');
            return;
        }

        emailjs.send('service_1ew76zf', 'template_8hvg1wu', {
            user_name: name,
            user_email: email,
            subject: subject,
            message: message
        }).then(function(response) {
            alert('Message sent successfully!');
            $('#contactForm')[0].reset();
        }, function(error) {
            alert('Failed to send message: ' + error.text);
        });
    });
});


