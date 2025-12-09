/**
 * Theme Toggle Functionality
 */
function initTheme() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const themeToggleInput = document.getElementById('theme-toggle-input');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = 'light';
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        currentTheme = 'dark';
    }

    applyTheme(currentTheme, htmlElement, bodyElement, themeToggleInput);
}

function applyTheme(theme, htmlElement, bodyElement, themeToggleInput) {
    if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        bodyElement.classList.add('dark');
        if (themeToggleInput) {
            themeToggleInput.checked = true;
            themeToggleInput.setAttribute('aria-checked', 'true');
        }
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        bodyElement.classList.remove('dark');
        if (themeToggleInput) {
            themeToggleInput.checked = false;
            themeToggleInput.setAttribute('aria-checked', 'false');
        }
    }

    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const themeToggleInput = document.getElementById('theme-toggle-input');

    const isDark = themeToggleInput ? themeToggleInput.checked : false;
    const newTheme = isDark ? 'dark' : 'light';

    applyTheme(newTheme, htmlElement, bodyElement, themeToggleInput);
}

function setupThemeToggle() {
    const themeToggleInput = document.getElementById('theme-toggle-input');

    if (!themeToggleInput) return;

    themeToggleInput.addEventListener('change', () => {
        toggleTheme();
    });
}

/**
 * Scroll Spy
 */
function setupScrollSpy() {
    gsap.registerPlugin(ScrollTrigger);

    const navLinks = document.querySelectorAll('.navbar-right a');

    navLinks.forEach(link => {
        const sectionId = link.getAttribute('href');

        if (!sectionId || !sectionId.startsWith('#')) return;
        const section = document.querySelector(sectionId);

        if (section) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 60%",
                end: "bottom 60%",

                onEnter: () => {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                },

                onEnterBack: () => {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                },

                onLeaveBack: () => {
                    link.classList.remove('active');
                },

                onLeave: () => {
                    link.classList.remove('active');
                }
            });
        }
    });
}

/**
 * Smooth Nav Scroll
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('.navbar-right a, .social-links a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    if (window.lenis) {
                        e.preventDefault();
                        
                        const horizontalSection = document.querySelector('.horizontal-section');
                        
                        if (horizontalSection && target.offsetTop > horizontalSection.offsetTop && window.horizontalScrollTrigger) {
                            window.horizontalScrollTrigger.disable(false);
                            
                            window.lenis.scrollTo(target, {
                                offset: 0,
                                duration: 1.5,
                                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                                onComplete: () => {
                                    setTimeout(() => {
                                        if (window.horizontalScrollTrigger) {
                                            window.horizontalScrollTrigger.enable();
                                        }
                                        if (typeof ScrollTrigger !== 'undefined') {
                                            ScrollTrigger.refresh();
                                        }
                                    }, 200);
                                }
                            });
                        } else {
                            window.lenis.scrollTo(target, {
                                offset: 0,
                                duration: 1.5,
                                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                            });
                        }
                    }
                }
            }
        });
    });
}

/**
 * GSAP Image Animation
 */
function setupImageAnimation() {
    const container = document.querySelector('.image-container');
    const image = document.querySelector('.hero-image');
    const overlay = document.querySelector('.light-overlay');

    if (!container || !image || !overlay) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(container, {
        duration: 1.5,
        clipPath: "inset(0% 0 0 0)",
        ease: "power4.out"
    }, "start");

    tl.to(image, {
        duration: 1.5,
        scale: 1,
        ease: "power4.out"
    }, "start");

    let xTo = gsap.quickTo(overlay, "--x", {duration: 0.8, ease: "power2.out"});
    let yTo = gsap.quickTo(overlay, "--y", {duration: 0.8, ease: "power2.out"});

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        xTo(x);
        yTo(y);
    });

    container.addEventListener('mouseleave', () => {
        const rect = container.getBoundingClientRect();
        xTo(rect.width / 2);
        yTo(rect.height / 2);
    });
}

/**
 * Master GSAP Timeline
 */
function setupMasterTimeline() {
    const masterTl = gsap.timeline({ delay: 0.1 });

    const navItems = document.querySelectorAll('.navbar-left img, .navbar-left .location, .navbar-right a, .navbar-right .switch');

    if (navItems.length > 0) {
        masterTl.from(navItems, {
            y: -20,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        }, 0.2);
    }

    const roles = document.querySelectorAll('.role-item');

    roles.forEach((role, index) => {
        const finalText = role.getAttribute('data-value');
        const chars = "!<>-_\\/[]{}—=+*^?#________";

        masterTl.to(role, {
            duration: 1.5,
            ease: "power2.out",
            onStart: () => {
                let frame = 0;
                const totalFrames = 30;

                const interval = setInterval(() => {
                    frame++;

                    let output = "";
                    for(let i = 0; i < finalText.length; i++) {
                        if (i < (frame / totalFrames) * finalText.length) {
                            output += finalText[i];
                        } else {
                            output += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }

                    role.innerText = output;

                    if(frame >= totalFrames) {
                        clearInterval(interval);
                        role.innerText = finalText;
                    }
                }, 50);
            }
        }, 0.6 + (index * 0.2));
    });

    const badge = document.querySelector('.orbit-badge');

    if (badge) {
        masterTl.from(badge, {
            scale: 0,
            rotation: -180,
            autoAlpha: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, 1.0);
    }
}

/**
 * GSAP Horizontal Scroll
 */
function setupHorizontalScroll() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({

        "(min-width: 901px)": function() {

            const track = document.querySelector(".project-track");
            const panels = gsap.utils.toArray(".project-panel");

            if (!track || panels.length === 0) return;

            const totalWidth = track.scrollWidth;
            const viewPortWidth = window.innerWidth;
            const amountToScroll = totalWidth - viewPortWidth;

            const tween = gsap.to(track, {
                x: -amountToScroll,
                ease: "none",
            });

            window.horizontalScrollTrigger = ScrollTrigger.create({
                trigger: ".horizontal-section",
                start: "top top",
                end: () => "+=" + amountToScroll,
                pin: true,
                animation: tween,
                scrub: 1,
                invalidateOnRefresh: true,

                snap: {
                    snapTo: 1 / (panels.length - 1),
                    inertia: false,
                    duration: { min: 0.1, max: 0.2 },
                    delay: 0.05,
                    ease: "power1.inOut"
                }
            });
        },

        "(max-width: 900px)": function() {
            gsap.set(".project-track", {
                clearProps: "all"
            });

            gsap.set(".horizontal-section", {
                clearProps: "all"
            });
        }
    });
}

/**
 * Achievement Reveal Animation
 */
function setupAchievementReveal() {
    gsap.registerPlugin(ScrollTrigger);

    const header = document.querySelector(".achievements-header h2");
    if (header) {
        gsap.from(header, {
            scrollTrigger: {
                trigger: ".achievements-header",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1.0,
            ease: "power4.out",
            clearProps: "all"
        });
    }

    const items = document.querySelectorAll(".achievement-item");
    if (items.length > 0) {
        gsap.from(items, {
            scrollTrigger: {
                trigger: ".achievements-list",
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all"
        });
    }
}

/**
 * Reveal Animation for Projects Section
 */
function setupProjectReveal() {
    if (window.innerWidth <= 900) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".horizontal-section");
    const header = document.querySelector(".project-header h2");
    const label = document.querySelector(".scroll-label");
    const trackWrapper = document.querySelector(".project-track-wrapper");

    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    if (header) {
        tl.from(header, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });
    }

    if (label) {
        tl.from(label, {
            x: -30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8");
    }

    if (trackWrapper) {
        tl.from(trackWrapper, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            clearProps: "transform"
        }, "-=0.8");
    }
}

/**
 * Mobile Project Animations
 */
function setupMobileProjectAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
        "(max-width: 900px)": function() {

            const projectHeader = document.querySelector(".project-header h2");
            if (projectHeader) {
                gsap.from(projectHeader, {
                    scrollTrigger: {
                        trigger: ".project-header",
                        start: "top 85%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1.0,
                    ease: "power4.out",
                    clearProps: "all"
                });
            }

            const panels = document.querySelectorAll('.project-panel');

            panels.forEach((panel) => {
                gsap.set(panel, {
                    scale: 0.95,
                    opacity: 0.6,
                    filter: "grayscale(100%)"
                });

                gsap.to(panel, {
                    scale: 1,
                    opacity: 1,
                    filter: "grayscale(0%)",
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 60%",
                        end: "bottom 40%",
                        toggleActions: "play reverse play reverse",
                    }
                });
            });
        }
    });
}

/**
 * Reveal Animation for Contact Section
 */
function setupContactReveal() {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".contact-section");

    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse"
        }
    });

    const header = document.querySelector(".contact-header h2");
    if (header) {
        tl.from(header, {
            y: 80,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    }

    const leftItems = document.querySelectorAll(".contact-left .big-statement, .contact-left .meta-item");
    if (leftItems.length > 0) {
        tl.from(leftItems, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=1.0");
    }

    const formItems = document.querySelectorAll(".technical-form .form-group, .technical-form button");
    if (formItems.length > 0) {
        tl.from(formItems, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform"
        }, "-=1.2");
    }
}

/**
 * Reveal Animation for Footer
 */
function setupFooterReveal() {
    gsap.registerPlugin(ScrollTrigger);

    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: footer,
            start: "top 95%",
            toggleActions: "play none none reverse"
        }
    });

    const footerItems = document.querySelectorAll(".footer-brand span, .footer-socials .social-icon");

    if (footerItems.length > 0) {
        tl.from(footerItems, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "all"
        });
    }
}

/**
 * Smart Video Handler
 */
function setupVideoPlayback() {
    const videos = document.querySelectorAll('.project-video');

    if (videos.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.classList.add('is-loaded');

                if (video.preload === "none") {
                    video.preload = "metadata";
                }

                if (video.paused) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Autoplay paused by browser (normal on mobile):", error);
                        });
                    }
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, observerOptions);

    videos.forEach(video => {
        if (window.innerWidth <= 900) {
            video.classList.add('is-loaded');
        }
        videoObserver.observe(video);
    });
}

/**
 * Lenis Smooth Scroll Integration
 */
function initLenis() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis library not loaded');
        return null;
    }

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    window.lenis = lenis;

    ScrollTrigger.refresh();

    setTimeout(() => {
        updateSmoothScrollToLenis();
    }, 100);

    return lenis;
}

function updateSmoothScrollToLenis() {
    if (!window.lenis) return;

    const footerLinks = document.querySelectorAll('.footer-socials a[href^="#"]');

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#' || !href) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeToggle();
    setupScrollSpy();
    setupImageAnimation();

    initLenis();

    setupMasterTimeline();
    setupHorizontalScroll();
    setupVideoPlayback();
    setupSmoothScroll();
    setupAchievementReveal();
    setupProjectReveal();
    setupMobileProjectAnimations();
    setupContactReveal();
    setupFooterReveal();
    setupFormSubmission();
    setupAchievementModal();

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (cursorDot && cursorOutline) {
            let dotX = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3.out"});
            let dotY = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3.out"});

            let outlineX = gsap.quickTo(cursorOutline, "x", {duration: 0.5, ease: "power3.out"});
            let outlineY = gsap.quickTo(cursorOutline, "y", {duration: 0.5, ease: "power3.out"});

            let isCursorVisible = false;

            window.addEventListener('mousemove', (e) => {
                if (!isCursorVisible) {
                    isCursorVisible = true;
                    gsap.to([cursorDot, cursorOutline], {
                        opacity: 1,
                        duration: 0.4
                    });
                }

                dotX(e.clientX);
                dotY(e.clientY);

                outlineX(e.clientX);
                outlineY(e.clientY);
            });

            document.addEventListener('mouseleave', () => {
                isCursorVisible = false;
                gsap.to([cursorDot, cursorOutline], { opacity: 0, duration: 0.4 });
            });
        }
    }

    if (window.matchMedia("(hover: hover)").matches) {

        const revealContainer = document.querySelector('.hover-reveal-cursor');
        const revealImg = document.querySelector('.reveal-img');
        const items = document.querySelectorAll('.achievement-item');
        const listParent = document.querySelector('.achievements-list');

        if (revealContainer && revealImg && listParent && items.length > 0) {

            gsap.set(revealContainer, {
                xPercent: -50,
                yPercent: -50
            });

            window.addEventListener('mousemove', (e) => {
                gsap.to(revealContainer, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.4,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            });

            listParent.addEventListener('mouseenter', (e) => {
                gsap.set(revealContainer, {
                    x: e.clientX,
                    y: e.clientY
                });

                gsap.to(revealContainer, {
                    autoAlpha: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            listParent.addEventListener('mouseleave', () => {
                gsap.to(revealContainer, {
                    autoAlpha: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            items.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const imgUrl = item.getAttribute('data-img');

                    if (imgUrl) {
                        revealImg.style.backgroundImage = `url(${imgUrl})`;

                        gsap.fromTo(revealImg,
                            { scale: 0.9 },
                            {
                                scale: 1,
                                duration: 0.4,
                                ease: "power2.out",
                                overwrite: true
                            }
                        );
                    }
                });
            });
        }
    }
});

/**
 * Contact Section - Time Display
 */
function updateTime() {
    const timeDisplay = document.getElementById('local-time');
    if (timeDisplay) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        timeDisplay.innerText = `(${timeString})`;
    }
}

setInterval(updateTime, 1000);
updateTime();

/**
 * Email Copy Functionality
 */
function copyEmail() {
    const email = "mjmfaeldonia@outlook.com";
    const feedback = document.querySelector('.copy-feedback');

    navigator.clipboard.writeText(email).then(() => {
        if (feedback) {
            feedback.classList.add('show');

            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/**
 * Form Submission Handler
 */
function setupFormSubmission() {
    const form = document.getElementById("contact-form");
    const contactSection = document.querySelector('.contact-right');
    const resetBtn = document.getElementById('reset-form-btn');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const originalBtnText = submitBtn ? submitBtn.querySelector('.button-text').innerText : 'Submit';

    if (!form) return;

    async function handleSubmit(event) {
        event.preventDefault();

        const btnText = submitBtn.querySelector('.button-text');
        btnText.innerText = "SENDING...";
        submitBtn.disabled = true;

        const data = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactSection.classList.add('sent');
                setTimeout(() => form.reset(), 500);
            } else {
                alert("Oops! There was a problem submitting your form.");
                btnText.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            alert("Oops! There was a problem submitting your form.");
            btnText.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    form.addEventListener("submit", handleSubmit);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            contactSection.classList.remove('sent');

            const btnText = submitBtn.querySelector('.button-text');
            btnText.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    }
}

/**
 * Contact Section - Name Input Auto-Resize
 */
function setupNameAutofit() {
    const nameInput = document.getElementById('name');

    if (!nameInput || !nameInput.closest('.technical-form')) return;

    function resizeInput() {
        let currentSize = 24;
        nameInput.style.fontSize = currentSize + 'px';

        while (nameInput.scrollWidth > nameInput.clientWidth && currentSize > 12) {
            currentSize--;
            nameInput.style.fontSize = currentSize + 'px';
        }
    }

    nameInput.addEventListener('input', resizeInput);
    window.addEventListener('resize', resizeInput);
    resizeInput();
}

/**
 * Contact Section - Textarea Auto-Resize
 */
function setupTextareaAutoresize() {
    const textarea = document.getElementById('message');
    const wrapper = textarea ? textarea.closest('.textarea-wrapper') : null;

    if (!textarea || !wrapper) return;

    function autoResize() {
        textarea.style.height = 'auto';
        const newHeight = textarea.scrollHeight;
        textarea.style.height = newHeight + 'px';
        wrapper.style.minHeight = newHeight + 'px';
    }

    textarea.addEventListener('input', autoResize);
    window.addEventListener('resize', autoResize);
    autoResize();
}

/**
 * Mobile Achievement Lightbox
 */
function setupAchievementModal() {
    const modal = document.getElementById('achievement-modal');
    const modalImg = document.getElementById('modal-image');
    const items = document.querySelectorAll('.achievement-item');

    if (!modal || !modalImg) return;

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {

                const imgUrl = item.getAttribute('data-img');

                if (imgUrl) {
                    modalImg.src = imgUrl;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    modal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            modalImg.src = '';
        }, 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupNameAutofit();
    setupTextareaAutoresize();
});
