import React from 'react';
import axios from 'axios';

const Payment = () => {
  const handleRazorpayPayment = async (amount, purchasedProducts) => {
    try {
    
      const { data: order } = await axios.post('/api/create-razorpay-order', { amount, currency: 'INR' });

      if (!order.id) {
        console.error('Error: Razorpay order ID not received');
        return;
      }

      // Razorpay options
      const options = {
        key: 'rzp_test_GsUAh2atNEW2CJ', 
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Your Company Name',
        description: 'Transaction for your purchase',
        handler: async (response) => {
          const verification = await axios.post('/api/verify-razorpay-payment', response);

          if (verification.data.success) {
            alert('Payment successful and verified!');
            // Call API to update stock after payment is verified
            await updateProductStock(purchasedProducts);
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new Razorpay(options);

      if (!rzp1) {
        console.error('Error: Razorpay object not created');
        return;
      }

      rzp1.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
    }
  };

  // Update product stock after payment is successful
  const updateProductStock = async (purchasedProducts) => {
    try {
      const productIds = purchasedProducts.map((product) => product.productId);
      const response = await axios.post('http://localhost:3000/api/products/delete-after-checkout', {
        productIds,
      });

      if (response.data.success) {
        console.log('Stock updated successfully');
      } else {
        console.error('Error updating stock:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className='pt-24'>
      <h1>Pay with Razorpay</h1>
      {/* Example products */}
      <button onClick={() => handleRazorpayPayment(500, [
        { productId: 'PROD-01', name: 'Product 1' },
        { productId: 'PROD-02', name: 'Product 2' }
      ])}>Pay ₹500</button>
    </div>
  );
};

export default Payment;
