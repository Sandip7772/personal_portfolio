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
    
    // Feedback popup (replaces the browser alert)
    const popupIcons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
    };
    let popupLastFocus = null;

    const $popup = $(
        '<div class="form-popup" aria-hidden="true">' +
            '<div class="form-popup-box" role="alertdialog" aria-modal="true" aria-labelledby="form-popup-title" aria-describedby="form-popup-text">' +
                '<div class="form-popup-icon"></div>' +
                '<h3 id="form-popup-title"></h3>' +
                '<p id="form-popup-text"></p>' +
                '<button type="button" class="form-popup-close btn btn-primary">OK</button>' +
            '</div>' +
        '</div>'
    ).appendTo('body');

    function closePopup() {
        $popup.removeClass('show').attr('aria-hidden', 'true');
        // Only restore focus on desktop; on phones it would reopen the keyboard
        if (popupLastFocus && window.matchMedia('(hover: hover)').matches) { popupLastFocus.focus({ preventScroll: true }); }
    }

    function showPopup(type, title, text) {
        popupLastFocus = document.activeElement;
        // Close the on-screen keyboard so the popup is not hidden behind it on phones
        if (popupLastFocus && popupLastFocus !== document.body && popupLastFocus.blur) { popupLastFocus.blur(); }
        $popup.attr('data-type', type);
        $popup.find('.form-popup-icon').html(popupIcons[type]);
        $popup.find('h3').text(title);
        $popup.find('p').text(text);
        $popup.addClass('show').attr('aria-hidden', 'false');
        $popup.find('.form-popup-close')[0].focus({ preventScroll: true });
    }

    $popup.on('click', function(e){
        if (e.target === this || $(e.target).hasClass('form-popup-close')) { closePopup(); }
    });
    $(document).on('keydown', function(e){
        if (e.key === 'Escape' && $popup.hasClass('show')) { closePopup(); }
    });

    // Email validation helpers
    const commonDomainTypos = {
        'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
        'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com',
        'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yahooo.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotnail.com': 'hotmail.com',
        'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com'
    };

    function checkEmailFormat(email) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
        const parts = email.split('@');
        if (!emailRegex.test(email) || email.indexOf('..') !== -1 || parts[0].charAt(0) === '.' || parts[0].slice(-1) === '.') {
            return 'Please enter a valid email address.';
        }
        const suggestion = commonDomainTypos[parts[1].toLowerCase()];
        if (suggestion) {
            return 'Did you mean ' + parts[0] + '@' + suggestion + '?';
        }
        return '';
    }

    // Checks the domain has mail (MX) records via DNS-over-HTTPS. Only the domain is sent.
    // If the lookup itself fails (offline, blocked), do not block the visitor.
    function domainReceivesMail(domain) {
        const controller = new AbortController();
        const timer = setTimeout(function(){ controller.abort(); }, 4000);
        return fetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(domain) + '&type=MX', {
            headers: { 'Accept': 'application/dns-json' },
            signal: controller.signal
        }).then(function(res){
            if (!res.ok) { throw new Error('lookup failed'); }
            return res.json();
        }).then(function(data){
            clearTimeout(timer);
            if (data.Status === 3) { return false; }
            return !!(data.Answer && data.Answer.length);
        }).catch(function(){
            clearTimeout(timer);
            return true;
        });
    }

    // Form submission handler
    $('#contactForm').on('submit', function(e){
        e.preventDefault();

        const name = $('input[name="user_name"]').val();
        const email = $('input[name="user_email"]').val();
        const subject = $('input[name="subject"]').val();
        const message = $('textarea[name="message"]').val();

        if(!name || !email || !message || !subject){
            showPopup('error', 'Missing details', 'Please fill in all required fields.');
            return;
        }

        const $submitBtn = $(this).find('button[type="submit"]');
        const submitLabel = $submitBtn.text();
        const resetSubmitBtn = function(){
            $submitBtn.removeClass('is-loading').prop('disabled', false).text(submitLabel);
        };

        const formatError = checkEmailFormat(email);
        if(formatError){
            showPopup('error', 'Invalid email', formatError);
            return;
        }

        $submitBtn.addClass('is-loading').prop('disabled', true).text('Checking email...');

        domainReceivesMail(email.split('@')[1]).then(function(canReceive){
            if(!canReceive){
                resetSubmitBtn();
                showPopup('error', 'Email not recognised', 'The domain in your email address cannot receive mail. Please check for typos and try again.');
                return;
            }
            $submitBtn.text('Sending...');
            sendMessage();
        });

        function sendMessage(){
        const now = new Date();
        const pad = function(n){ return String(n).padStart(2, '0'); };
        const time = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() +
            ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());

        emailjs.send('service_1ew76zf', 'template_8hvg1wu', {
            name: name,
            user_name: name,
            email: email,
            user_email: email,
            time: time,
            subject: subject,
            message: message
        }).then(function(response) {
            resetSubmitBtn();
            showPopup('success', 'Message sent', 'Thank you for getting in touch. I will reply soon, and a confirmation has been sent to your email.');
            $('#contactForm')[0].reset();
        }, function(error) {
            resetSubmitBtn();
            showPopup('error', 'Message not sent', 'Something went wrong' + (error && error.text ? ' (' + error.text + ')' : '') + '. Please try again in a moment.');
        });
        }
    });
});


