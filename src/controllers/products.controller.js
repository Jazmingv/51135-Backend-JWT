import Products from "../models/products.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

//GETALL
export const getAllProducts = async (req, res) => {
    try {
        let { limit, page, sort, _id, title, category } = req.query;

        let filter = {};
        _id && (filter._id = _id);
        title && (filter.title = title);
        category && (filter.category = category);

        let options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sort && { price: sort === "asc" ? 1 : -1 },
        };

        let result = await Products.paginate(filter, options);
        const obj = result.docs.map(prod => prod);
        const datos = obj.map(prod => {
            const { _id, title, category, description, price, code, stock, thumbnail, status } = prod;
            return { _id, title, category, description, price, code, stock, thumbnail, status };
        });

        const responseObj = {
            status: "success",
            payload: datos,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : '',
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : '',
            user: req.session.user,
            isValid: true
        }

        console.log(responseObj.user);
        
        res.status(200).render("./indexProducts", responseObj);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't render products view");
    }
};

//GETBYID
export const getProductByID = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).send("Couldn't get product with ID");
    }
};

//CREATE
export const createProduct = async (req, res) => {

    const newProduct = new Products(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't create product, please try again");
    }
};

//UPDATE
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Products.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't update product, please try again");
    }
};
export const deleteProduct = async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.status(200).json("Succesfully deleted product");
    } catch (error) {
        console.log(error);
        res.status(500).send("Couldn't delete product, please try again");
    }
};