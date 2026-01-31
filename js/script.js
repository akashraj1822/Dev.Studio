// Initialize Supabase
// specific configuration is in js/config.js
// Use a different name for the client to avoid shadowing the global 'supabase' object from the CDN
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    const formMessage = document.getElementById('form-message');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);
            const data = {
                name: formData.get('name'),
                business: formData.get('business'),
                phone: formData.get('phone'),
                requirement: formData.get('requirement'),
                urgency: formData.get('urgency')
            };

            // Basic validation check (Supabase will fail if not configured, so we handle that)
            if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_URL.includes('PASTE_YOUR_URL')) {
                // Simulation for demo purposes if keys are missing
                console.warn("Supabase keys not correctly set");
                setTimeout(() => {
                    formMessage.innerText = "Please update js/config.js with your real Supabase URL and Key.";
                    formMessage.style.color = 'red';
                    formMessage.classList.remove('hidden');
                    bookingForm.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            try {
                const { error } = await supabaseClient
                    .from('leads')
                    .insert([data]);

                if (error) throw error;

                formMessage.innerText = "Thanks! I’ll contact you within 12 hours.";
                formMessage.classList.remove('hidden');
                formMessage.style.color = 'green';
                bookingForm.reset();

            } catch (error) {
                console.error('Error submitting form:', error);
                formMessage.innerText = "Something went wrong. Please try again or WhatsApp me.";
                formMessage.style.color = 'red';
                formMessage.classList.remove('hidden');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    document.querySelectorAll('.service-card, .step, .pricing-box, .section-title, .trust-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation
    const style = document.createElement('style');
    style.innerHTML = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
