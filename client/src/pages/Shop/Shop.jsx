import React from "react";
import Shopbanner from "../../section/Shop/Shopbanner";
import ShopProducts from "../../section/Shop/ShopProducts";

const Shop = () => {
  return (
    <>
      <div className=" pt-[80px] max-sm:hidden">
        <Shopbanner />
      </div>

      <div>
        <ShopProducts />
      </div>
    </>
  );
};

export default Shop;
