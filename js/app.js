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



    // Latest blog posts, read from the blog's posts.json feed
    (function loadLatestBlogs() {
        const BLOG_URL = 'https://blog.khadkasandip.com.np';
        const MAX_POSTS = 9;
        const grid = document.getElementById('latestBlogsGrid');
        if (!grid) { return; }

        // Only accept links and images that live on the blog's own domain
        function safeBlogUrl(value) {
            try {
                const u = new URL(value, BLOG_URL);
                return u.origin === BLOG_URL ? u.href : '';
            } catch (err) { return ''; }
        }
        function formatDate(value) {
            const d = new Date(value);
            if (isNaN(d.getTime())) { return ''; }
            return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
        }
        function el(tag, className, text) {
            const node = document.createElement(tag);
            if (className) { node.className = className; }
            if (text) { node.textContent = text; }
            return node;
        }
        function showMessage(text) {
            grid.textContent = '';
            grid.appendChild(el('p', 'latest-blogs-status', text));
        }
        // Blog links open the blog post in a new tab
        function openInNewTab(link) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        function buildCard(post) {
            const url = safeBlogUrl(post.url);
            if (!url || !post.title) { return null; }

            const card = el('article', 'blog-card');
            const imgUrl = post.image ? safeBlogUrl(post.image) : '';
            if (imgUrl) {
                const imgLink = el('a', 'blog-card-img');
                imgLink.href = url;
                openInNewTab(imgLink);
                imgLink.tabIndex = -1;
                imgLink.setAttribute('aria-hidden', 'true');
                const img = el('img');
                img.src = imgUrl;
                img.alt = '';
                img.loading = 'lazy';
                imgLink.appendChild(img);
                card.appendChild(imgLink);
            }

            const body = el('div', 'blog-card-body');
            const date = formatDate(post.date);
            if (date) { body.appendChild(el('span', 'blog-card-date', date)); }
            const title = el('h3');
            const titleLink = el('a', '', String(post.title));
            titleLink.href = url;
            openInNewTab(titleLink);
            title.appendChild(titleLink);
            body.appendChild(title);
            if (post.excerpt) { body.appendChild(el('p', '', String(post.excerpt))); }
            const more = el('a', 'blog-card-more', 'Read More');
            more.href = url;
            openInNewTab(more);
            body.appendChild(more);
            card.appendChild(body);
            return card;
        }

        const controller = new AbortController();
        const timer = setTimeout(function(){ controller.abort(); }, 6000);
        fetch(BLOG_URL + '/posts.json', { signal: controller.signal })
            .then(function(res){
                clearTimeout(timer);
                if (!res.ok) { throw new Error('feed unavailable'); }
                return res.json();
            })
            .then(function(posts){
                const cards = (Array.isArray(posts) ? posts : [])
                    .sort(function(a, b){ return new Date(b.date) - new Date(a.date); })
                    .slice(0, MAX_POSTS)
                    .map(buildCard)
                    .filter(Boolean);
                if (!cards.length) { showMessage('New posts are coming soon.'); return; }
                grid.textContent = '';
                cards.forEach(function(card){
                    const slide = el('div', 'blog-slide');
                    slide.appendChild(card);
                    grid.appendChild(slide);
                });
                // One post at a time, scrollable and auto-playing, like the Reviews section
                $(grid).slick({
                    autoplay: true,
                    autoplaySpeed: 3000,
                    arrows: false,
                    dots: true,
                    appendDots: '.latest-blogs-dots',
                    dotsClass: 'dots',
                    infinite: true,
                    speed: 300,
                    cssEase: 'linear',
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    pauseOnHover: true
                });
            })
            .catch(function(){
                clearTimeout(timer);
                showMessage('Read my latest posts on the blog.');
            });
    })();

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

    // Checks the domain can receive mail via DNS-over-HTTPS. Only the domain is sent.
    // A domain with no MX record can still receive mail at its A/AAAA address (RFC 5321), so fall back to that.
    // If a lookup itself fails (offline, blocked), do not block the visitor.
    function dnsLookup(domain, type) {
        const controller = new AbortController();
        const timer = setTimeout(function(){ controller.abort(); }, 4000);
        return fetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(domain) + '&type=' + type, {
            headers: { 'Accept': 'application/dns-json' },
            signal: controller.signal
        }).then(function(res){
            clearTimeout(timer);
            if (!res.ok) { throw new Error('lookup failed'); }
            return res.json();
        }, function(err){
            clearTimeout(timer);
            throw err;
        });
    }

    function domainReceivesMail(domain) {
        return dnsLookup(domain, 'MX').then(function(mx){
            if (mx.Status === 3) { return false; }
            if (mx.Answer && mx.Answer.length) { return true; }
            return dnsLookup(domain, 'A').then(function(a){
                return !!(a.Answer && a.Answer.length);
            });
        }).catch(function(){
            return true;
        });
    }

    // Google reCAPTCHA v2 (site key is public; the secret key lives only in the EmailJS dashboard)
    const RECAPTCHA_SITE_KEY = '6LfLgdstAAAAAHJ7vucHOdN0svs0oh1MzNL3yRhw';
    let captchaWidgetId = null;

    window.renderContactCaptcha = function () {
        if (captchaWidgetId !== null || !window.grecaptcha || !document.getElementById('contactCaptcha')) { return; }
        captchaWidgetId = grecaptcha.render('contactCaptcha', { sitekey: RECAPTCHA_SITE_KEY });
    };
    if (window.recaptchaReady) { window.renderContactCaptcha(); }

    // Spam / abuse limits (client-side; slows casual bots only, see EmailJS dashboard limits too)
    const MIN_FILL_MS = 3000;            // humans take longer than this to fill the form
    const COOLDOWN_MS = 60 * 1000;       // minimum gap between sends
    const MAX_PER_HOUR = 3;              // sends allowed per browser per hour
    const SEND_LOG_KEY = 'contactSendLog';
    const formShownAt = Date.now();
    let isSending = false;

    function readSendLog() {
        try {
            const log = JSON.parse(localStorage.getItem(SEND_LOG_KEY) || '[]');
            return Array.isArray(log) ? log.filter(function(t){ return Date.now() - t < 3600000; }) : [];
        } catch (err) { return []; }
    }
    function recordSend() {
        try {
            const log = readSendLog();
            log.push(Date.now());
            localStorage.setItem(SEND_LOG_KEY, JSON.stringify(log));
        } catch (err) { /* storage unavailable: ignore */ }
    }
    function sendLimitMessage() {
        const log = readSendLog();
        if (log.length && Date.now() - log[log.length - 1] < COOLDOWN_MS) {
            return 'Please wait a minute before sending another message.';
        }
        if (log.length >= MAX_PER_HOUR) {
            return 'You have reached the message limit for now. Please try again later.';
        }
        return '';
    }

    // Form submission handler
    $('#contactForm').on('submit', function(e){
        e.preventDefault();

        if (isSending) { return; }

        // Honeypot: real visitors never see or fill this field, bots usually do. Pretend success.
        if ($('input[name="hp_check"]').val()) {
            showPopup('success', 'Message sent', 'Thank you for getting in touch.');
            this.reset();
            return;
        }
        if (Date.now() - formShownAt < MIN_FILL_MS) {
            showPopup('error', 'Please slow down', 'Please take a moment to review your message and try again.');
            return;
        }
        const limitMessage = sendLimitMessage();
        if (limitMessage) {
            showPopup('error', 'Too many messages', limitMessage);
            return;
        }

        if (captchaWidgetId === null) {
            showPopup('error', 'Verification unavailable', 'The security check could not load. Please refresh the page and try again.');
            return;
        }
        const captchaToken = grecaptcha.getResponse(captchaWidgetId);
        if (!captchaToken) {
            showPopup('error', 'Please verify', 'Please tick "I\'m not a robot" before sending.');
            return;
        }

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
            isSending = false;
            $submitBtn.removeClass('is-loading').prop('disabled', false).text(submitLabel);
        };

        const formatError = checkEmailFormat(email);
        if(formatError){
            showPopup('error', 'Invalid email', formatError);
            return;
        }

        isSending = true;
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
            message: message,
            'g-recaptcha-response': captchaToken
        }).then(function(response) {
            grecaptcha.reset(captchaWidgetId);
            resetSubmitBtn();
            recordSend();
            showPopup('success', 'Message sent', 'Thank you for getting in touch. I will reply soon, and a confirmation has been sent to your email.');
            $('#contactForm')[0].reset();
        }, function(error) {
            grecaptcha.reset(captchaWidgetId);
            resetSubmitBtn();
            showPopup('error', 'Message not sent', 'Something went wrong' + (error && error.text ? ' (' + error.text + ')' : '') + '. Please try again in a moment.');
        });
        }
    });
});


