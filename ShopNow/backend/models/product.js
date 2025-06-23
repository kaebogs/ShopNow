import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"],
            maxLength: [200, "Product name must be at least 200 characters"],
        },
        price: {
            type: Number,
            required: [true, "Please enter a product price"],
            maxLength: [5, "Product price cannot exceed 5 digits"],
        },
        description: {
            type: String,
            required: [true, "Please enter a product description"],
        },
        ratings: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                }
            }
        ],
        category: {
            type: String,
            required: true,
            enum: {
                values: [
                    "Electronics",
                    "Cameras",
                    "Laptops",
                    "Accessories",
                    "Headphones",
                    "Food",
                    "Books",
                    "Sports",
                    "Outdoor",
                    "Home"
                ],
                message: "Please select a category",
            }
        },
        seller: {
            type: String,
            required: [true, "Please enter a product seller"]
        },
        stock: {
            type: Number,
            required: [true, "Please enter a product stock"],
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                }
            }
        ],
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    }, {timestamps: true}
)

export default mongoose.model("Product", productSchema);