import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.readProducts();
    }

    readProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    writeProducts() {
        try {
            const data = JSON.stringify(this.products);
            fs.writeFileSync(this.path, data);
        } catch (error) {
            console.log(error);
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.writeProducts();
    }

    async getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    async getProductById(id) {
        const product = this.products.find((product) => product.id === parseInt(id));


        if (!product) {
            console.log('Producto no encontrado');
        }

        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index === -1) {
            console.log('Producto no encontrado');
            return;
        }

        const product = this.products[index];
        const newProduct = { ...product, ...updatedProduct };
        this.products[index] = newProduct;
        this.writeProducts();
    }

    deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index === -1) {
            console.log('Producto no encontrado');
            return;
        }

        const product = this.products[index];
        this.products.splice(index, 1);
        this.writeProducts();

        console.log(`Producto con id:${product.id} eliminado`);
    }
}

// Ejemplo de uso
const pm = new ProductManager('./products.json');

pm.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10.99,
    thumbnail: '/img/product1.jpg',
    code: '001',
    stock: 50,
});

pm.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 12.99,
    thumbnail: '/img/product2.jpg',
    code: '002',
    stock: 75,
});

async function run() {
    const products = await pm.getProducts();
    console.log(products);

    const product = await pm.getProductById(2);
    console.log(product);

    pm.updateProduct(2, {
        title: 'Producto 4 Actualizado',
        description: 'Descripción actualizada del producto 2',
        price: 25.99,
        thumbnail: '/img/product2-updated.jpg',
    });

    pm.deleteProduct(4);
}

run();

export default ProductManager;
