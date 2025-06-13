import React from "react";

const GiftCardPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-poppins pt-24">
      {/* Header Section */}
      <header className="bg-gray-300 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-900">QuickStore Gift Card</h1>
        <div className="space-x-4">
          <a href="#" className="text-blue-500 hover:underline">
            Buy a Gift Card
          </a>
          <a href="#" className="text-blue-500 hover:underline">
            Check Gift Card Balance
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Gift Card Form */}
        <div className="bg-green-200 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Buy a QuickStore Gift Card</h2>

          {/* Tab Section */}
          <div className="flex border-b">
            <button className="px-4 py-2 text-blue-500 font-medium border-b-2 border-blue-500">
              PERSONAL GIFT CARDS
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-blue-500">
              CORPORATE REQUIREMENTS
            </button>
          </div>

          {/* Form Section */}
          <div className="mt-4 flex flex-wrap gap-6">
            {/* Left Section */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Receiver's Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter receiver's email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Receiver's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter receiver's name"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Card Value in ₹
                  </label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>500</option>
                    <option>1000</option>
                    <option>2000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No of Cards
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gifter's Name (Optional)
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Write a message (Optional, 100 characters)
                </label>
                <textarea
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="100"
                  placeholder="Write a message"
                />
              </div>
              <button className="text-blue-500 hover:underline">
                + Add Another Gift Card
              </button>
            </div>

            {/* Right Section */}
            <div className="w-80 bg-blue-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Gift Card Value</h3>
              <div className="bg-white border border-dashed rounded-lg p-6 flex flex-col items-center">
                <div className="text-4xl font-bold text-gray-700">₹0</div>
                <img
                  src="https://via.placeholder.com/150" // Replace with the actual Flipkart gift card image
                  alt="Gift Card"
                  className="mt-4"
                />
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded-md text-lg font-medium hover:bg-orange-600">
            BUY GIFT CARD FOR ₹0
          </button>
        </div>

        {/* FAQs Section */}
        <section className="mt-10 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">FAQs</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium">How do I buy/gift a Flipkart Gift Card?</h4>
              <p>
                Enter the name and email of the receiver, select the card value, and click
                'Proceed To Pay.'
              </p>
            </div>
            <div>
              <h4 className="font-medium">Does my Flipkart Gift Card expire?</h4>
              <p>All Flipkart Gift Cards expire 1 year from the date of creation.</p>
            </div>
            <a href="#" className="text-blue-500 hover:underline">
              View all FAQs
            </a>
          </div>
        </section>

        {/* Terms Section */}
        <section className="mt-10 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Flipkart Gift Cards are valid for 1 year from the date of creation.</li>
            <li>They can be redeemed online on Flipkart's website or app.</li>
            <li>Cannot be used for bulk purchases.</li>
          </ul>
          <a href="#" className="text-blue-500 hover:underline">
            View all T&Cs
          </a>
        </section>
      </main>
    </div>
  );
};

export default GiftCardPage;
