import Carts from "../models/carts.model.js";
import Products from "../models/products.model.js";

//CREATE CART
//if (!currentCart) { cartController.createCart }
export const createCart = async (req, res) => {
    const newCart = new Carts();
    try {
        currentCart = await newCart.save();
        res.status(200).send(currentCart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't create cart, please try again");
    }
};

//DELETE ALL PRODUCTS
export const deleteAllProducts = async (req, res) => {
    try {
        let cartID = req.params.cid;
        
        let cart = await Carts.findOne({ _id: cartID });
        console.log(JSON.stringify(cart, null, '\t'));

        cart.products = [];
        console.log(JSON.stringify(cart, null, '\t'));

        let result = await Carts.updateOne({ _id: cartID }, cart);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't delete products in cart");
    }
};

//DELETE PRODUCT BY ID
export const deleteProduct = async (req, res) => {
    try {
        let cartID = req.params.cid;
        let productID = req.params.pid;

        let cart = await Carts.findOne({ "_id": cartID });


        let productIndex = cart.products.findIndex(prod => prod._id == productID);

        if (productIndex !== -1) {
            // Product exists in cart, delete it
            cart.products.splice(productIndex, 1);
        }

        let result = await Carts.updateOne({ _id: cartID }, cart);
        result = JSON.stringify(result, null, '\t')
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't delete the product in cart, please try again");
    }
};

//GET ALL CARTS
export const getCarts = async (req, res) => {
    try {
        let cart = await Carts.find();
        cart = console.log(JSON.stringify(cart, null, '\t'));

        res.status(200).send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't get products in cart");
    }
};

//GET PRODUCTS
export const getProducts = async (req, res) => {
    try {
        let cartID = req.params.cid;

        let cart = await Carts.findOne({ _id: cartID });

        let products = await Products.find({ _id: { $in: cart.products } });
        //console.log(JSON.stringify(products, null, '\t'));

        const data = { // Crea un objeto llamado "data".
            product: products.map((product, index) => { 
                    return { //Retorna un objeto con las propiedades requeridas para la vista.
                        title: product.title, // Título del producto.
                        description: product.description, // Descripción del producto.
                        category: product.category, // Categoría del producto.
                        price: product.price, // Precio del producto.
                        quantity: cart.products[index].quantity
                    }
                }
            ),
            hasPrevPage: false, //Propiedad para indicar si existe una página anterior a la actual.
            hasNextPage: false, //Propiedad para indicar si existe una página posterior a la actual.
            prevLink: "", //Enlace a la página anterior.
            nextLink: "", //Enlace a la página siguiente.
            page: 1 //Número de página actual.
        }

        res.status(200).render("./indexCart", data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't get products in cart");
    }
};

//UPDATE PRODUCT BY ID
export const increaseQuantityProduct = async (req, res) => {
    try {
        let cartID = req.params.cid;
        let productID = req.params.pid;

        let cart = await Carts.findOne({ "_id": cartID });
        console.log(cart);

        let productIndex = cart.products.findIndex(prod => prod._id.toString() === productID);

        console.log(`product Index: ${productIndex}`);

        if (productIndex !== -1) {
            // Product exists in cart, increase quantity
            cart.products[productIndex].quantity += 1;
        } else {
            // Product doesn't exist in cart, add it
            cart.products.push({quantity: 1}, { product: productID } );
        }

        let result = await Carts.updateOne({ _id: cartID }, cart);

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't update product with the given ID, please try again");
    }
};