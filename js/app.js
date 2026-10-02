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
let lockedScrollY = 0;

function setMobileNavOpen(isOpen, options) {
    options = options || {};
    mobileNav.classList.toggle('open', isOpen);
    hamberger.classList.toggle('active', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    hamberger.setAttribute('aria-expanded', String(isOpen));
    hamberger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');

    if (isOpen) {
        lockedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.width = '100%';
    } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (options.restoreScroll !== false) {
            window.scrollTo(0, lockedScrollY);
        }
    }
}

hamberger.addEventListener('click', function(){
    setMobileNavOpen(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function(e){
        const targetId = link.getAttribute('href');
        const targetEl = targetId && targetId.startsWith('#') ? document.querySelector(targetId) : null;

        setMobileNavOpen(false, { restoreScroll: !targetEl });

        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    });
});

document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMobileNavOpen(false);
    }
});

let navSpyLinks = document.querySelectorAll('header nav .left a[href^="#"], .mobile-nav ul li a[href^="#"]');
let navSpySections = Array.from(
    new Set(Array.from(navSpyLinks).map(function (link) { return link.getAttribute('href'); }))
)
    .map(function (href) { return document.querySelector(href); })
    .filter(Boolean);

function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = navSpySections.length ? navSpySections[0].id : null;

    navSpySections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
            currentId = section.id;
        }
    });

    navSpyLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('load', updateActiveNavLink);
window.addEventListener('resize', updateActiveNavLink);
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateActiveNavLink);
}
setInterval(updateActiveNavLink, 500);
updateActiveNavLink();

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


