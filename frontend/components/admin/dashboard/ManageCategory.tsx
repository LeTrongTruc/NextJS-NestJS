"use client";
import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { TableColumnsType } from "antd";
import { POST_ADMIN } from "@/components/common";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalUpdateCategory from "@/components/modals/ModalUpdateCategory";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const App: React.FC = () => {
  const [isOpenModalUpdateCategory, setIsOpenModalUpdateCategory] =
    useState(false);
  const [id, setId] = useState();
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Category Parent",
      dataIndex: "parentData",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record: any) => (
        <div
          className="text-blue-600"
          onClick={() => {
            setIsOpenModalUpdateCategory(true);
            setId(record._id);
          }}
        >
          Update
        </div>
      ),
    },
  ];
  const [key, setKey] = useState<any>(null);

  const callApi = async () => {
    const data = await POST_ADMIN("/admin/getCategoryForList", {
      skip: (currentPage - 1) * pageSize,
      key
    });
    if (data.result) {
      data.data.forEach((item: any) => (item.key = item._id));
      return data.data;
    }
  };

  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["listCategory"], queryFn: callApi });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      const response = await POST_ADMIN("/admin/deleteCategory", {
        _id: selectedRowKeys,
      });
      if (response.result) {
        toast("delete category success");
        queryClient.invalidateQueries({ queryKey: ["listCategory"] });
      }
    }
  };

  const handleChangePage = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["listCategory"] });
  }, [currentPage, pageSize, key]);

  return (
    <div className="w-[98%] mr-5 mt-2">
      {/* <div style={{ marginBottom: 16 }}>

                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
            </div> */}
      <div className="text-2xl font-semibold">List category</div>
      <div className="w-full flex justify-end">
        <input type="text" className="px-3 py-3 w-[350px] mt-3 outline-none mb-3 border" placeholder="Nhập vào gì đó" onChange={(e) => setKey(e.target.value)} />
      </div>
      <Table
        bordered
        rowSelection={rowSelection}
        pagination={{
          total: count,
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "30"],
          onChange: handleChangePage,
        }}
        className="rounded-2xl text-center "
        columns={columns}
        dataSource={query.data}
      />
      <div
        className="mt-[-60px] border rounded z-50 relative bg-white p-3 w-max cursor-pointer"
        onClick={() => handleDelete()}
      >
        Delete
      </div>
      <ModalUpdateCategory
        isOpenModalLogin={isOpenModalUpdateCategory}
        setIsOpenModalLogin={setIsOpenModalUpdateCategory}
        id={id}
      ></ModalUpdateCategory>
    </div>
  );
};

export default App;
