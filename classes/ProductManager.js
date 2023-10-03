import fs from 'fs';

class ProductManager{
    constructor(){
        this.products = [];
        this.productId = 1;
        this.path = "../products.json";
    }

    getProducts(){
        if(fs.existsSync(this.path)){
            const JSONreaded = fs.readFileSync(this.path, "utf-8");
            const productsToObject = JSON.parse(JSONreaded);
            return productsToObject ;
        } else {
            console.log("The file does not exist");
        }
    }

    addProduct = (productAdded) => {
        const codeProductAdded = productAdded.code;
        let productInSystem = this.products.some((element) => element.code === codeProductAdded);
        if(productInSystem != true){

            const newProduct ={
                id: this.productId++,
                title: productAdded.title,
                description: productAdded.description,
                price: productAdded.price,
                thumbnail : productAdded.thumbnail,
                code : productAdded.code,
                status: productAdded.status,
                stock: productAdded.stock,
                category: productAdded.category,
            };

            this.products.push(newProduct);
            const productsToJSON = JSON.stringify(this.products);       //transformo el array a archivo tipo JSON y lo escribo con fs.write
            fs.writeFileSync(this.path, productsToJSON);
        } else {
            console.error("The code of the product is already in our system");
        }
    }

    getProductById(idSearched){
        const JSONreaded = fs.readFileSync(this.path,"utf-8");
        const productsToObject = JSON.parse(JSONreaded);
        let productInSystem = productsToObject.find((element) => element.id === idSearched);     //find devuelve el producto o undefined
        if(productInSystem){
            console.warn("The product is already loaded in our system");
            return productInSystem;
        } else {
            console.error("The product was not found");
        }
    }

    updateProduct(productId, dataToUpdate){
        const JSONreaded = fs.readFileSync(this.path,"utf-8");
        const productsToObject = JSON.parse(JSONreaded);
        let ubication = productsToObject.findIndex((element) => element.id === productId);    //findIndex devuelve -1 si no encuentra la posicion
        if(ubication == -1){
            console.error("The product was not found");
        } else {
            const updatedProduct = {
                id: productId,
                ...dataToUpdate
            };
            productsToObject[ubication] = updatedProduct;
            const productsToJSON = JSON.stringify(productsToObject);
            fs.writeFileSync(this.path, productsToJSON);
            console.log("The product information was updated");
        }
    }

    deleteProduct(productId){
        const JSONreaded = fs.readFileSync(this.path,"utf-8");
        const productsToObject = JSON.parse(JSONreaded);
        let productInSystem = productsToObject.some((element) => element.id === productId);     //some devuelve una variable bool
        if(productInSystem){
            const ubication = productsToObject.findIndex((element) => element.id === productId);
            productsToObject.splice(ubication,1);
            console.log(productsToObject);
            const productsToJSON = JSON.stringify(productsToObject);
            fs.writeFileSync(this.path, productsToJSON);
            console.log("The product was deleted");
        } else {
            console.error("The product was not found");
        }
    }
}

//const productManager = new ProductManager();
//productManager.getProducts();

// PRODUCTS
const product1 = {
    title: "Product1",
    description: "Description1",
    thumbnail : "Image1",
    price: "Price1",
    status: true,
    code : "Code1",
    stock: "Stock1",
    category: "Category1",
};

const product2 = {
    title: "Product2",
    description: "Description2",
    thumbnail : "Image2",
    price: "Price2",
    status: true,
    code : "Code2",
    stock: "Stock2",
    category: "Category2",
};

const product3 = {
    title: "Product3",
    description: "Description3",
    thumbnail : "Image3",
    price: "Price3",
    status: true,
    code : "Code3",
    stock: "Stock3",
    category: "Category3",
};

const product4 = {
    title: "Product4",
    description: "Description4",
    thumbnail : "Image4",
    price: "Price4",
    status: true,
    code : "Code4",
    stock: "Stock4",
    category: "Category4",
};

//ADD PRODUCT
//productManager.addProduct(product1);
//productManager.addProduct(product2);
//productManager.addProduct(product3);

//SEARCH BY ID
//productManager.getProductById(2);
//productManager.getProductById(4);

//UPDATE INFORMATION
const informationToUpdate = {
    title: "Updated Product",
    description: "Updated Description",
    thumbnail : "Updated Image",
    price: "Updated Price",
    status: false,
    code : "Updated Code",
    stock: "Updated Stock",
    category: "Updated Category",
};
//productManager.updateProduct(1, informationToUpdate);

//DELETE A PRODUCT
//productManager.deleteProduct(1);

export default ProductManager;