import catchAsyncError from "../middleware/catchAsyncError.js";
import Stripe from "stripe";
import Order from "../models/order.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//This is my first time using Stripe, so I need to take notes on what happens in each part of the code.

// Create Stripe Session => api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncError(async (req, res, next) => {
  // Extract the body of the request, which contains the order and shipping information
  const body = req?.body;

  // Map over the order items to format them into the structure Stripe expects for checkout sessions
  const line_items = body?.orderItems?.map((item) => {
    return {
        price_data: {
            currency: "usd", // Set currency to USD for the transaction
            product_data: {
                name: item?.name, // Product name from the item
                images: [item?.image], // Product image (array)
                metadata: {productId: item?.product}, // Product ID from metadata
            },
            unit_amount: item?.price * 100, // Price in cents (Stripe requires amounts in cents)
        },
        // Set the tax rate for the item (using a fixed tax rate ID)
        tax_rates: ["txr_1REA1I02Ozs8oJmsnnmIXNNP"], 
        quantity: item?.quantity, // Quantity of the item in the cart
    }
  })

  // Extract shipping information from the request body
  const shippingInfo = body?.shippingInfo

  // Set shipping rate based on the items price (e.g., if the items' total price is above $200, use a different shipping rate)
  const shipping_rate =
    body?.itemsPrice >= 200
      ? "shr_1RE9uf02Ozs8oJmsXVJSjPdB" // High value shipping rate ID
      : "shr_1RE9uH02Ozs8oJms1buEUPKy"; // Standard shipping rate ID

  // Create the Stripe checkout session using the formatted data
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Allow payment by card
    success_url: `${process.env.FRONTEND_URL}/me/order?order_success=true`, // URL to redirect to after successful payment
    cancel_url: `${process.env.FRONTEND_URL}`, // URL to redirect to if the user cancels the payment
    customer_email: req?.user?.email, // Customer's email (from user object)
    client_reference_id: req?.user?._id?.toString(), // Reference to the user's ID
    mode: "payment", // Set the mode to "payment" for single payments
    metadata: {...shippingInfo, itemsPrice: body?.itemsPrice}, // Additional metadata about the order, including shipping info and total price
    shipping_options: [
      {
        shipping_rate, // Use the appropriate shipping rate based on the items' price
      },
    ],
    line_items, // The formatted line items for the checkout session
  });

  console.log("Session => ", session)

  // Send the session URL back to the frontend for the user to complete the payment
  res.status(200).json({
    url: session.url, // The URL for the user to complete the checkout process
  })
});


const getOrderItems = async (line_items) => {
  // Use Promise.all to handle multiple asynchronous operations in parallel for each item in the line_items array
  const cartItems = await Promise.all(
    line_items?.data?.map(async (item) => {
      // Retrieve the product details using the Stripe API with the product ID from the line item
      const product = await stripe.products.retrieve(item.price.product);

      // Extract the custom product ID from the product's metadata
      const productId = product.metadata.productId;

      // Return an object with relevant product details including:
      // - product ID from metadata
      // - product name
      // - price (converted from cents to dollars)
      // - quantity of the product
      // - first image of the product
      return {
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100, // Convert from cents to dollars
        quantity: item.quantity,
        image: product.images[0], // Get the first image of the product
      };
    })
  );

  // Return the array of formatted cart items
  return cartItems;
};

// create new order after payment = /api/v1/payment/webhook
export const stripeWebhook = catchAsyncError(async(req, res, next) => {
  try {
     // Retrieve the Stripe signature from the request headers
     const signature = req.headers["stripe-signature"]

     // Verify and construct the event using the raw body and the signature, using the webhook secret
     const event = stripe.webhooks.constructEvent(
      req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET
     )

     // Check if the event type is "checkout.session.completed" (indicating successful payment)
     if(event.type ==="checkout.session.completed"){
        // Extract session data from the event object
        const session = event.data.object;
        console.log("Sessions => ", session)

        // Fetch the line items (products) associated with this session using the session ID
        const line_items = await stripe.checkout.sessions.listLineItems(
          session.id
        )

        // Get detailed product information for each line item in the session
        const orderItems = await getOrderItems(line_items);

        // Extract customer-related data from the session
        const user = session.client_reference_id;
        
        // Convert the amount details from cents to dollars (Stripe returns amounts in cents)
        const totalAmount = session.amount_total / 100;
        const taxAmount = session.total_details.amount_tax / 100;
        const shippingAmount = session.total_details.amount_shipping / 100;
        
        // Extract the items' price from the session metadata
        const itemsPrice = session.metadata.itemsPrice;

        // Create an object containing shipping information extracted from the session metadata
        const shippingInfo = {
          address: session.metadata.address,
          city: session.metadata.city,
          phoneNo: session.metadata.phoneNo,
          postalCode: session.metadata.postalCode,
          country: session.metadata.country
        }

        // Create an object containing payment information
        const paymentInfo = {
          id: session.payment_intent, // Payment intent ID
          status: session.payment_status // Payment status (e.g., succeeded, pending)
        }

        // Create the order data object, including all necessary information
        const orderData = {
          shippingInfo, // Shipping details
          orderItems, // List of items ordered
          itemsPrice, // Price of the items
          taxAmount, // Tax amount
          shippingAmount, // Shipping fee
          totalAmount, // Total order amount
          paymentInfo, // Payment details
          paymentMethod: "Card", // Method of payment (assumed to be Card here)
          user, // User (client) reference ID
        }

        // Log the constructed order data for debugging purposes
        console.log("Order_data => ", orderData)

        // Save the order data into the database (assumed Order.create is a database call)
        await Order.create(orderData);

        // Respond to Stripe indicating the webhook was processed successfully
        res.status(200).json({
          success: true
         })
     }
  } catch (error) {
    // Catch and log any errors that occur during the processing of the webhook
    console.log("ERROR => ", error);
  }
})
