const axios = require('axios');
const crypto = require('crypto');
const { ECOMMERCE_API_URL, COMPANIES, AUTH } = require('./config');

async function fetchProducts(category) {
    let products = [];
    for (const company of COMPANIES) {
        const url = `${ECOMMERCE_API_URL}/${company}/categories/${category}/products`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `${AUTH.token_type} ${AUTH.access_token}`
            }
        });
        if (response.status === 200) {
            products = products.concat(response.data.products);
        }
    }
    return products;
}

function generateProductId(product) {
    const productStr = `${product.company}_${product.id}`;
    return crypto.createHash('md5').update(productStr).digest('hex');
}

function sortProducts(products, sortBy, order) {
    const reverse = order === "desc";
    return products.sort((a, b) => {
        if (reverse) {
            return b[sortBy] - a[sortBy];
        }
        return a[sortBy] - b[sortBy];
    });
}

module.exports = {
    fetchProducts,
    generateProductId,
    sortProducts
};
