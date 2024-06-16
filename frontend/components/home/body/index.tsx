import ListProduct from "./ListProduct";

export default function Body({ data }: any) {
  return (
    <div className="mt-2">
      {data?.data?.map((item: any) =>
        (<ListProduct nameCategory={item.category.name} product={item.products} key={1}></ListProduct>))}
    </div>
  );
}
