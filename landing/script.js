// Ajwaa Landing Page — script.js

// ─── FORM SUBMIT ───
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const txt = document.getElementById('submitText');
    const load = document.getElementById('submitLoading');
    const form = document.getElementById('accessForm');
    const success = document.getElementById('formSuccess');

    // Collect form data
    const data = {
        name:  document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        goal:  document.getElementById('goal').value,
        why:   document.getElementById('why').value.trim(),
        ts:    new Date().toISOString(),
    };

    // Store locally (Formspree / backend can be wired in later)
    const existing = JSON.parse(localStorage.getItem('ajwaa_requests') || '[]');
    existing.push(data);
    localStorage.setItem('ajwaa_requests', JSON.stringify(existing));

    // Show loading
    btn.disabled = true;
    txt.style.display = 'none';
    load.style.display = 'inline';

    // Simulate async (replace with real fetch to Formspree / backend)
    setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
    }, 1200);
}

// ─── SCROLL ANIMATIONS ───
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Animate feature cards staggered
    const cards = document.querySelectorAll('.feature-card, .stat-card, .why-list li');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        card.style.transition = `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`;
        observer.observe(card);
    });

    // Animate section headings
    const headings = document.querySelectorAll('.section-headline, .oneword-headline, .access-headline');
    headings.forEach(h => {
        h.style.opacity = '0';
        h.style.transform = 'translateY(16px)';
        h.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(h);
    });
});

// Override IntersectionObserver to add 'visible' class
const _observe = IntersectionObserver.prototype.observe;
IntersectionObserver.prototype.observe = function(target) {
    // when an element is observed, set up the trigger
    _observe.call(this, target);
};

// Re-wire the callback to actually apply styles
document.addEventListener('DOMContentLoaded', () => {
    const animEls = document.querySelectorAll('.feature-card, .stat-card, .why-list li, .section-headline, .oneword-headline, .access-headline');
    
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    animEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity 0.55s ${(i % 8) * 0.06}s ease, transform 0.55s ${(i % 8) * 0.06}s ease`;
        io.observe(el);
    });
});

// ─── MOCKUP LIVE CLOCK (subtle touch) ───
// Could add a live clock on the mockup to make it feel alive
