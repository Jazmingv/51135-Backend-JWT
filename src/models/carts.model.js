import mongoose from "mongoose";
import ProductsModel from "./products.model.js";


const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: ProductsModel,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

cartsSchema.pre('findOne', function () {
    this.populate("products.product");
});

const cartsModel = mongoose.model("Carts", cartsSchema);
export default cartsModel;