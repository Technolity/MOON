const products = {
    saffron: {
        title: "Red Jewel.",
        subtitle: "The world's most precious spice.",
        theme: "saffron",
        color: "#F25C2A",
        desc: "Hand-picked from the autumn fields of Pampore. Each strand is a testament to patience and purity, bringing vibrant color and aroma.",
        price: "₹850",
        details: "Mongra A++<br>Deep Red Stigmas",
        featureName: "Kashmiri Saffron",
        featureDesc: "Hand-selected Mongra threads from Pampore's autumn harvest."
    },
    honey: {
        title: "Liquid Gold.",
        subtitle: "Vitamin-packed purity from the Sidr valleys.",
        theme: "honey",
        color: "#F7B500",
        desc: "Our Sidr Honey is harvested from the sacred Lote trees of Yemen. Known for potent antimicrobial properties and a rich, caramel-forward profile.",
        price: "₹1500",
        details: "Top Grade Sidr<br>100% Organic",
        featureName: "Sidr Honey",
        featureDesc: "Raw reserve honey from Yemen's highland valleys, cold filtered and unblended."
    },
    shilajit: {
        title: "Mountain Strength.",
        subtitle: "Pure Himalayan resin for focus and recovery.",
        theme: "shilajit",
        color: "#4FB0D3",
        desc: "Sourced from high-altitude Himalayan rocks, this purified resin is rich in fulvic acid and trace minerals to support daily vitality.",
        price: "₹1999",
        details: "Gold Grade Resin<br>High Potency",
        featureName: "Pure Shilajit",
        featureDesc: "Mineral-dense resin traditionally used for endurance, clarity, and stamina."
    }
};

const productKeys = Object.keys(products);
let currentIndex = 0;
let cart = [];

const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroImage = document.getElementById('hero-image');
const heroVisualContainer = document.getElementById('hero-visual-container');
const pillBtns = document.querySelectorAll('.pill-btn');

const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailPrice = document.getElementById('detail-price');
const detailCardContent = document.getElementById('detail-card-content');
const featureProductName = document.getElementById('feature-product-name');
const featureProductDesc = document.getElementById('feature-product-desc');

const navbar = document.getElementById('navbar');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');
const newsletterForm = document.getElementById('newsletter-form');

initialize();

function initialize() {
    updateView(productKeys[currentIndex]);
    setupProductNavigation();
    setupCartEvents();
    setupGlobalInteractions();
    setupRevealAnimation();
}

function setupProductNavigation() {
    pillBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.product;
            const newIndex = productKeys.indexOf(key);
            if (newIndex === -1) return;
            currentIndex = newIndex;
            updateView(key);
        });
    });

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + productKeys.length) % productKeys.length;
            updateView(productKeys[currentIndex]);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % productKeys.length;
            updateView(productKeys[currentIndex]);
        });
    }
}

function setupCartEvents() {
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }

    if (cartModal) {
        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                toggleCart();
            }
        });
    }

    document.querySelectorAll('.add-btn, .purchase-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const cardBody = event.target.closest('.product-card');
            let title;
            let price;

            if (cardBody) {
                title = cardBody.querySelector('h3')?.textContent || 'MOON Item';
                price = parseCurrency(cardBody.querySelector('.price')?.textContent || '₹0');
            } else {
                title = detailTitle?.textContent || 'MOON Item';
                price = parseCurrency(detailPrice?.textContent || '₹0');
            }

            addToCart({ title, price });
            flashAddFeedback(event.target);
        });
    });

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const removeBtn = event.target.closest('.remove-item');
            if (!removeBtn) return;
            const index = Number(removeBtn.dataset.index);
            if (Number.isNaN(index)) return;
            removeFromCart(index);
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                window.alert('Your cart is empty.');
                return;
            }

            window.alert('Thank you for your order. This is a demo checkout.');
            cart = [];
            updateCartUI();
            toggleCart();
        });
    }
}

function setupGlobalInteractions() {
    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll);

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const button = newsletterForm.querySelector('.newsletter-button');
            if (!button) return;

            const defaultText = button.textContent;
            button.textContent = 'Subscribed';
            button.disabled = true;

            setTimeout(() => {
                newsletterForm.reset();
                button.textContent = defaultText;
                button.disabled = false;
            }, 1500);
        });
    }
}

function setupRevealAnimation() {
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function updateView(key) {
    const product = products[key];
    if (!product) return;

    document.body.dataset.theme = product.theme;

    animateTextSwap(heroTitle, product.title);
    animateTextSwap(heroSubtitle, product.subtitle, 100);

    if (detailTitle) detailTitle.textContent = product.title;
    if (detailDesc) detailDesc.textContent = product.desc;
    if (detailPrice) detailPrice.textContent = product.price;
    if (detailCardContent) detailCardContent.innerHTML = product.details;
    if (featureProductName) featureProductName.textContent = product.featureName;
    if (featureProductDesc) featureProductDesc.textContent = product.featureDesc;

    pillBtns.forEach((btn) => {
        const isActive = btn.dataset.product === key;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const storyCanvas = document.getElementById('story-frame-canvas');
    if (storyCanvas) storyCanvas.style.display = 'block';
    if (heroVisualContainer) heroVisualContainer.style.display = 'none';

    if (window.storytellingEngine) {
        window.storytellingEngine.setProduct(key);
    } else if (heroImage) {
        heroImage.innerHTML = '<div class="floating">Loading visuals...</div>';
    }
}

function animateTextSwap(element, content, delay = 0) {
    if (!element) return;
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = `slideUpFade 0.6s ${delay}ms forwards`;
    element.textContent = content;
}

function updateNavbarOnScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
}

function parseCurrency(value) {
    return Number(String(value).replace(/[^\d]/g, '')) || 0;
}

function flashAddFeedback(button) {
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = 'Added';
    button.style.background = '#3a8c55';
    button.style.borderColor = '#3a8c55';
    button.style.color = '#ffffff';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.color = '';
    }, 900);
}

function addToCart(item) {
    cart.push(item);
    updateCartUI();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    if (!cartModal) return;
    cartModal.classList.toggle('hidden');
}

function updateCartUI() {
    if (cartCount) {
        cartCount.textContent = String(cart.length);
    }

    if (cartBtn) {
        cartBtn.setAttribute('aria-label', `Open cart with ${cart.length} items`);
    }

    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        cartTotal.textContent = '₹0';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart
        .map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item">
                    <div>
                        <h4>${item.title}</h4>
                        <small>₹${item.price}</small>
                    </div>
                    <button class="remove-item" type="button" data-index="${index}" aria-label="Remove ${item.title}">x</button>
                </div>
            `;
        })
        .join('');

    cartTotal.textContent = `₹${total}`;
}

window.removeFromCart = removeFromCart;
