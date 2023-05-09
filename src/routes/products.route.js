import express from "express";
import * as Products from "../controllers/products.controller.js";

const ProductRouter = express.Router();

//GETALL
ProductRouter.get("/", Products.getAllProducts);

//GETBYID
ProductRouter.get("/:pid", Products.getProductByID);

//CREATE
ProductRouter.post("/", Products.createProduct);

//UPDATE
ProductRouter.put("/:pid", Products.updateProduct);

//DELETE
ProductRouter.delete("/:pid", Products.deleteProduct);

export default ProductRouter;