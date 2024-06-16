import ListProduct from "./ListProduct";

export default function Body({ data, category }: any) {
  const categoryName = category.split('-')[0]
  return (
    <div className="mt-2 flex">
      <div className="w-full flex justify-center ">
        <div className="w-[1300px] flex  items-center flex-col">
          <div className="justify-self-start self-start ml-2">Kết quả tìm kiếm theo <span className="text-lg font-semibold">{categoryName}</span> </div>
          {data?.data?.map((item: any) =>
            (<ListProduct nameCategory={categoryName} product={item.products} key={1}></ListProduct>))}
        </div>
      </div>
    </div>
  );
}
