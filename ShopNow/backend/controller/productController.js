import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../models/order.js"
import { delete_file, uploadImage } from "../utils/cloudinary.js";

//get all the products => /api/v1/products
export const getProducts = catchAsyncError(async (req, res) => {
  const resPerPage = 4;

  //to filter products base on the keyword
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;
  let filteredProducts = products.length;

  //to limit the response per page
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  if (!products) {
    return next(new ErrorHandler("Error creating product", 400));
  }

  res.status(200).json({
    resPerPage,
    filteredProducts,
    products,
  });
});

//create a new product => /api/v1/admin/products
export const newProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  // links the product being created
  //to the user who created it by storing the user’s ID in the user field of the product.

  const product = await Product.create(req.body);

  if (!product) {
    return next(new ErrorHandler("Error creating product", 400));
  }

  res.status(200).json({
    product,
  });
});

//get a single product => api/v1/products/id
export const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(200).json({
    product,
  });
});

//update product => api/v1/products/id
export const updateProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Error updating product", 400));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

//delete product => api/v1/products/id
export const deleteProduct = catchAsyncError(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Error deleting Product", 400));
  }

  // delete images of this product
  for(let i=0; i<product?.images?.length; i++){
    await delete_file(product?.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

// Create/update product review => api/v1/reviews
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //check if product already reviewed by the same user
  const isReviewed = product?.reviews?.find(
    (review) => review.user.toString() === req?.user?._id.toString()
  );

  // if review then it will update the comment and rating
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    // if not reviewed then it will update the review section and pass the user, rating, comment
    product.reviews.push(review);
  }

  product.numOfReviews = product.reviews.length;

  //calculate the rating of the product
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all the review => api/v1/reviews
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});


// delete product review => api/v1/admin/reviews
export const deleteReview = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //filter the reviews that will be deleted
  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  //calculate the rating of the product
  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    product
  });
});

// can user review => /api/v1/can_review
export const canUserReview = catchAsyncError(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  })

  if(orders.length === 0){
    return res.status(200).json({canReview: false})
  }

  res.status(200).json({
    canReview: true,
  })
});


// get admin product => /api/v1/admin/product
export const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(200).json({
    products,
  });
});


//uploadimages product => api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Error updating product", 400));
  }

  const uploader = async (image) => uploadImage(image, "Ecommerce_V1/products") ;

  const urls = await Promise.all((req?.body?.images).map(uploader));

  product?.images?.push(...urls);
  await product?.save();

  res.status(200).json({
    product,
  });
});

//delete images product => api/v1/admin/products/:id/delete_image
export const deleteProductImages = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Error deleting product image", 400));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if(isDeleted){
    product.images = product?.images?.filter((img) => img.public_id !== req.body.imgId);

    await product?.save();
  }

  res.status(200).json({
    product,
  });
});