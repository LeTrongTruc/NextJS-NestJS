"use client";
import { useState } from "react";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import ItemProduct from "./ItemProduct";

export interface ComponentProps {
  nameCategory: string;
  product: Array<object>;
}

const ListProduct: React.FC<ComponentProps> = ({ nameCategory, product }) => {
  console.log("🚀 ~ product:", product);

  return (
    <>
      <div className="text-3xl font-semibold">{nameCategory}</div>
      <div className="flex flex-wrap w-full justify-between ">
        {product?.map((item) => (
          <>
            <ItemProduct data={item} key={1}></ItemProduct>
          </>
        ))}
      </div>
    </>
  );
};
export default ListProduct;
