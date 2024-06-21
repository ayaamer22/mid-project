document.getElementById('homeBtn').addEventListener('click', loadAllProducts);
document.getElementById('categoriesBtn').addEventListener('click', loadCategories);
document.getElementById('searchBtn').addEventListener('click', searchProducts);

const categories = [
    "beauty", "fragrances", "furniture", "groceries", "home-decoration", 
    "kitchen-accessories", "laptops", "mens-shirts", "mens-shoes", 
    "mens-watches", "mobile-accessories", "motorcycle", "skin-care", 
    "smartphones", "sports-accessories", "sunglasses", "tablets", "tops", 
    "vehicle", "womens-bags", "womens-dresses", "womens-jewellery", 
    "womens-shoes", "womens-watches"
];

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('content').innerHTML = `<p>${error.message}</p>`;
        throw error;  // re-throw the error after logging it
    }
}

async function searchProducts() {
    const query = document.getElementById('search-input').value;
    if (query === '') {
        document.getElementById('content').innerHTML = '<p>Please enter a search term.</p>';
        return;
    }
    try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        displayProducts(products.products, `Search Results for "${query}"`);
    } catch (error) {
        handleError(error);
    }
}

function loadAllProducts() {
    fetchData(`https://dummyjson.com/products`) 
        .then(data => {
            displayProducts(data.products, 'All Products');
        });
}

function loadSingleProduct(id) {
    fetchData(`https://dummyjson.com/products/${id}`) 
        .then(product => {
            document.getElementById('content').innerHTML = `
                <h2>${product.title}</h2>
                <p>Price: $${product.price}</p>
                <p>${product.description}</p>
                <button onclick="removeProduct(${product.id})">Remove</button>
            `;
        });
}

function loadCategories() {
    let output = '<h2>Categories</h2>';
    categories.forEach(category => {
        output += `<button onclick="loadProductsByCategory('${category}')">${category}</button>`;
    });
    document.getElementById('content').innerHTML = output;
}

function loadProductsByCategory(categorySlug) {
    fetchData(`https://dummyjson.com/products/category/${categorySlug}`)
        .then(data => {
            displayProducts(data.products, `Products in ${categorySlug}`);
        });
}

function displayProducts(products, title) {
    let output = `<h2>${title}</h2>`;
    products.forEach(product => {
        output += `
            <div class="product" data-id="${product.id}">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="removeProduct(${product.id})">Remove</button>
                <button onclick="loadSingleProduct(${product.id})">View Details</button>
            </div>
        `;
    });
    document.getElementById('content').innerHTML = output;
}

function removeProduct(id) {
    fetch(`https://dummyjson.com/products/${id}`, { method: 'DELETE' }) 
        .then(response => {
            if (response.ok) {
                document.querySelector(`.product[data-id="${id}"]`).remove();
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        });
}

function handleError(error) {
    document.getElementById('content').innerHTML = `<p>${error.message}</p>`;
}

loadAllProducts();






