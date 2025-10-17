// Custom domain API endpoint
const API_ENDPOINT = 'https://api.architecture-demo.com/orders';

// Shopping cart array
let cart = [];

// Add item to cart
function addToCart(itemName, price) {
    cart.push({
        name: itemName,
        price: price
    });
    
    updateCartDisplay();
    showMessage(`✅ ${itemName} added to cart!`, 'success');
}

// Update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="color: #999;">Your cart is empty</p>';
        cartTotalDiv.innerHTML = '';
        return;
    }
    
    // Display cart items
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
        total += item.price;
    });
    
    cartItemsDiv.innerHTML = cartHTML;
    cartTotalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Place order
async function placeOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    
    // Validation
    if (!customerName) {
        showMessage('❌ Please enter your name', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showMessage('❌ Your cart is empty', 'error');
        return;
    }
    
    // Calculate total
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Prepare order data
    const orderData = {
        customerName: customerName,
        items: cart,
        totalAmount: totalAmount
    };
    
    // Disable button and show loading
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';
    
    try {
        // Send POST request to custom domain API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(`🎉 Order placed successfully! Order ID: ${result.orderId}`, 'success');
            
            // Clear cart and form
            cart = [];
            updateCartDisplay();
            document.getElementById('customerName').value = '';
        } else {
            showMessage(`❌ Error: ${result.error || 'Failed to place order'}`, 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    } finally {
        // Re-enable button
        btn.disabled = false;
        btn.textContent = 'Place Order';
    }
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Initialize cart display
updateCartDisplay();