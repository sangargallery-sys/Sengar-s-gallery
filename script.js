// Gallery Data
const allArtworks = [];
let cart = [];

// Load all artworks from JSON files
async function loadArtworks() {
    try {
        const artForms = [
            { file: 'data/bani-thani.json', category: 'bani-thani' },
            { file: 'data/miniature-paintings.json', category: 'miniature' },
            { file: 'data/madhubani.json', category: 'madhubani' },
            { file: 'data/pichwai.json', category: 'pichwai' },
            { file: 'data/warli.json', category: 'warli' }
        ];

        for (const art of artForms) {
            const response = await fetch(art.file);
            const data = await response.json();
            
            data.paintings.forEach(painting => {
                allArtworks.push({
                    ...painting,
                    category: art.category,
                    artForm: data.artForm
                });
            });
        }

        renderGallery('all');
        renderShop();
    } catch (error) {
        console.error('Error loading artworks:', error);
        // Fallback: render with sample data
        renderSampleData();
    }
}

// Render sample data if JSON files are not accessible
function renderSampleData() {
    const sampleArtworks = [
        {
            id: 1,
            title: "Women Performing Daily Rituals",
            category: 'bani-thani',
            artForm: 'Bani Thani',
            artist: "Master Artisan",
            price: 4500,
            tags: ["traditional", "cultural", "women"]
        },
        {
            id: 2,
            title: "Mughal Court Gathering",
            category: 'miniature',
            artForm: 'Miniature Paintings',
            artist: "Master Miniature Artist",
            price: 12000,
            tags: ["mughal", "court", "royal"]
        },
        {
            id: 3,
            title: "Radha Krishna Love Story",
            category: 'madhubani',
            artForm: 'Madhubani',
            artist: "Madhubani Master Artist",
            price: 5200,
            tags: ["krishna", "love", "mythology"]
        },
        {
            id: 4,
            title: "Krishna Butter Theft",
            category: 'pichwai',
            artForm: 'Pichwai',
            artist: "Pichwai Master",
            price: 8500,
            tags: ["krishna", "childhood", "divine"]
        },
        {
            id: 5,
            title: "Village Celebration",
            category: 'warli',
            artForm: 'Warli',
            artist: "Warli Tribal Artist",
            price: 3500,
            tags: ["tribal", "community", "celebration"]
        }
    ];

    allArtworks.push(...sampleArtworks);
    renderGallery('all');
    renderShop();
}

// Filter and render gallery
function filterArt(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderGallery(category);
}

// Render gallery
function renderGallery(category) {
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';

    const filtered = category === 'all' 
        ? allArtworks 
        : allArtworks.filter(art => art.category === category);

    if (filtered.length === 0) {
        galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No artworks found.</p>';
        return;
    }

    filtered.forEach(artwork => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <div class="gallery-card-image">🎨</div>
            <div class="gallery-card-content">
                <div class="gallery-card-title">${artwork.title}</div>
                <div class="gallery-card-artist">by ${artwork.artist}</div>
                <div class="gallery-card-price">₹${artwork.price}</div>
                <div class="gallery-card-tags">
                    <span class="tag">${artwork.artForm}</span>
                    ${artwork.tags ? artwork.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${artwork.id})">Add to Cart</button>
            </div>
        `;
        galleryGrid.appendChild(card);
    });
}

// Render shop
function renderShop() {
    const shopGrid = document.getElementById('shop-grid');
    shopGrid.innerHTML = '';

    allArtworks.forEach(artwork => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
            <div class="shop-card-image">🎨</div>
            <div class="shop-card-content">
                <div class="shop-card-title">${artwork.title}</div>
                <div class="shop-card-description">${artwork.artForm} - by ${artwork.artist}</div>
                <div class="shop-card-price">₹${artwork.price}</div>
                <div class="quantity-selector">
                    <button onclick="decreaseQty(this)">-</button>
                    <input type="number" value="1" min="1" readonly>
                    <button onclick="increaseQty(this)">+</button>
                </div>
                <button class="add-to-cart-btn-shop" onclick="addToCartWithQty(${artwork.id}, this)">Add to Cart</button>
            </div>
        `;
        shopGrid.appendChild(card);
    });
}

// Quantity selector functions
function increaseQty(btn) {
    const input = btn.parentElement.querySelector('input');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(btn) {
    const input = btn.parentElement.querySelector('input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to cart
function addToCart(id) {
    const artwork = allArtworks.find(art => art.id === id);
    if (artwork) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...artwork, quantity: 1 });
        }
        updateCart();
        alert(`${artwork.title} added to cart!`);
    }
}

// Add to cart with quantity
function addToCartWithQty(id, btn) {
    const qty = parseInt(btn.parentElement.querySelector('input').value);
    const artwork = allArtworks.find(art => art.id === id);
    
    if (artwork) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.push({ ...artwork, quantity: qty });
        }
        updateCart();
        alert(`${artwork.title} (x${qty}) added to cart!`);
    }
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
    } else {
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>Quantity: ${item.quantity} | ${item.artForm}</p>
                    </div>
                    <div>
                        <div class="cart-item-price">₹${item.price * item.quantity}</div>
                        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `;
        });
        cartItems.innerHTML = html;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = total;
    
    modal.style.display = 'block';
}

// Close cart modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    openCart();
}

// Checkout
function checkout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\n\nTotal: ₹${total}\n\nWe will contact you soon at sangargallery@gmail.com to confirm your order.`);
    cart = [];
    updateCart();
    closeCart();
}

// Handle contact form
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    alert(`Thank you ${name}!\n\nYour message has been received.\n\nWe will contact you at ${email} soon.`);
    form.reset();
}

// Cart icon click handler
document.addEventListener('DOMContentLoaded', function() {
    loadArtworks();

    // Add click handlers to cart icon
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('cart-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
