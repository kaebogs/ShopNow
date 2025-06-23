import Order from "../models/order.js";
import Product from "../models/product.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

// create a new order => /api/v1/order/new
export const createOrder = catchAsyncError( async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
    });

    res.status(200).json({
        order
    });
});

//get current user order => api/v1/me/order
export const myOrder = catchAsyncError( async (req, res, next) => {
    
    const orders = await Order.find({user: req.user._id});
    let myOrders = orders.length;

    res.status(200).json({
        myOrders,
        orders
    })
});

// get order details => api/v1/order/:id
export const getOrderDetails = catchAsyncError( async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next( new ErrorHandler("No Order Found with this ID", 400));
    }

    res.status(200).json({
        order
    })
});

// get all Orders - ADMIN => /api/v1/admin/orders
export const getAllOrders = catchAsyncError( async (req, res, next) => {

    const orders = await Order.find();
    const ordersNumber = orders.length;

    res.status(200).json({
        ordersNumber,
        orders,
    })

});

///Update Order - ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncError( async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this id", 404));
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    let productNotFound = false;

    //Update products stock
    for(const item of order?.orderItems) {
        const product = await Product.findById(item?.product?.toString());
        
        if(!product){
            productNotFound = true;
            break;
        }

        product.stock = product.stock - item.quantity;
        await product.save({validateBeforeSave: false});
    }
    
    if(productNotFound){
        return next(new ErrorHandler("No Product found with this id", 404));
    }

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    })

});

// Delete Order - ADMIN => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncError( async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this id", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    })
});

// I'm new to this, so I need to add comments to every line of code to help me understand how React Chart.js works
// This function gathers sales data between two given dates
async function getSalesData(startDate, endDate) {
    // Perform MongoDB aggregation to process and compute results from multiple Order documents
    const salesData = await Order.aggregate([
        {
            // Stage 1: Match orders whose 'createdAt' is between startDate and endDate
            $match: {
                createdAt: {
                    $gte: new Date(startDate), // Orders created on or after startDate
                    $lte: new Date(endDate),   // Orders created on or before endDate
                }
            }
        },
        {
            // Stage 2: Group matched orders by date (formatted as YYYY-MM-DD)
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } // Extract date only (no time)
                },
                totalSales: { $sum: "$totalAmount" }, // Sum up all 'totalAmount' fields for the day
                numOrders: { $sum: 1 } // Count how many orders were placed that day
            }
        }
    ]);

    // Log the grouped sales data in the terminal (for debugging purposes)
    console.log("Sales data =>", salesData);

    // Initialize a Map to organize sales data by date for easier lookup
    const salesMap = new Map();
    let totalSales = 0;        // sales total across the range
    let totalNumOrders = 0;    // total number of orders across the range

    // Loop through the aggregated sales data to populate salesMap and compute totals
    salesData.forEach((entry) => {
        const date = entry?._id.date;         // Get the formatted date string
        const sales = entry?.totalSales;      // Sales total for that date
        const numOrders = entry?.numOrders;   // Number of orders for that date

        salesMap.set(date, {sales, numOrders});  // Store the data in the map
        totalSales += sales;                     // Add to total sales
        totalNumOrders += numOrders;             // Add to total number of orders
    });

    // Generate a complete list of dates between startDate and endDate
    const datesBetween = getDatesBetween(startDate, endDate);

    // Prepare the final array of sales data including zero-sales dates
    const finalSalesData = datesBetween.map((date) => ({
         date,
         sales: (salesMap.get(date) || {sales: 0}).sales,           // Default to 0 if no sales on that date
         numOrders: (salesMap.get(date) || {numOrders: 0}).numOrders // Default to 0 if no orders on that date
    }));

    // Log the final structured sales array to the terminal
    console.log(finalSalesData);

    // Return the full dataset, along with computed totals
    return {salesData: finalSalesData, totalSales, totalNumOrders};
}

// Utility function to generate a list of all date strings between two dates
function getDatesBetween(startDate, endDate){
    const dates = [];
    let currentDate = new Date(startDate); // Start from the beginning date

    // Keep pushing formatted date strings until reaching endDate
    while(currentDate <= new Date(endDate)){
        const formattedDate = currentDate.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return dates;
}

// Route handler for ADMIN: Get Sales => /api/v1/admin/get_sales
export const getSales = catchAsyncError(async (req, res, next) => {
    // Extract startDate and endDate from request query parameters
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Normalize time: set start of day for startDate (00:00:00.000)
    startDate.setUTCHours(0, 0, 0, 0);

    // Normalize time: set end of day for endDate (23:59:59.999)
    endDate.setUTCHours(23, 59, 59, 999);
 
    // Call the main function to retrieve the sales data within the date range
    const {salesData, totalSales, totalNumOrders} = await getSalesData(startDate, endDate);

    // Send the final result back to the frontend
    res.status(200).json({
        totalSales,         // Total sales in the date range
        totalNumOrders,     // Total number of orders
        sales: salesData    // Daily breakdown of sales and orders
    });
});
