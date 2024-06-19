const express = require('express');
const { fetchProducts, generateProductId, sortProducts } = require('./helpers');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/categories/:category/products', async (req, res) => {
    try {
        const category = req.params.category;
        const n = parseInt(req.query.n, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const sortBy = req.query.sort_by || 'rating';
        const order = req.query.order || 'desc';

        let products = await fetchProducts(category);
        products = products.map(product => ({ ...product, id: generateProductId(product) }));

        
        products = sortProducts(products, sortBy, order);

        const start = (page - 1) * n;
        const end = start + n;
        const paginatedProducts = products.slice(start, end);

        const response = {
            products: paginatedProducts,
            total_products: products.length,
            page: page,
            n: n
        };
        res.json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories/:category/products/:productId', async (req, res) => {
    try {
        const category = req.params.category;
        const productId = req.params.productId;

        const products = await fetchProducts(category);
        const product = products.find(p => generateProductId(p) === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
