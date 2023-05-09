import express from "express";
import * as cartController from "../controllers/carts.controller.js";

const CartRouter = express.Router();

//GET ALL CARTS
CartRouter.get("/", cartController.getCarts);

//DELETE ALL PRODUCTS
CartRouter.delete("/:cid/", cartController.deleteAllProducts);

//DELETE PRODUCT
CartRouter.delete("/:cid/products/:pid", cartController.deleteProduct);

//GET PRODUCTS
CartRouter.get("/:cid", cartController.getProducts);

//ADD PRODUCT
CartRouter.post("/:cid/products/:pid", cartController.increaseQuantityProduct);

export default CartRouter;