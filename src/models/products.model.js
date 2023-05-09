import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 10
    },
    category: {
        type: String,
        required: true,
        enum: ["swimwear", "pajamas", "sets", "dresses"]
    },
    description: {
        type: String,
        maxlength: [150, "Shorten the description"]
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
        default: []
    },
    status: {
        type: Boolean,
        default: true
    }
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model("Products", productSchema);
export default productsModel;