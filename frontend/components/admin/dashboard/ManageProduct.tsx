'use client'
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { POST_ADMIN } from '@/components/common';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ModalUpdateProduct from '@/components/modals/ModalUpdateProduct';
import Image from '@/components/Image';

const App: React.FC = () => {
    const [isOpenModalUpdateCategory, setIsOpenModalUpdateCategory] = useState(false);
    const [id, setId] = useState();
    const [count, setCount] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [key, setKey] = useState<any>(null);

    const columns: TableColumnsType = [
        {
            title: 'CategoryID',
            dataIndex: 'category_id',
            className: 'bg-white text-center border',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            className: 'bg-white text-center border',

        },
        {
            title: 'Detail',
            dataIndex: 'detail',
            className: 'bg-white text-center border',

        },
        {
            title: 'Specification',
            dataIndex: 'specification',
            className: 'bg-white text-center border',

        },
        {
            title: 'Standard',
            dataIndex: 'standard',
            className: 'bg-white text-center border',

        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            className: 'bg-white text-center border',

        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            className: 'bg-white text-center border',

        },
        {
            title: 'Image',
            render: (_, record: any) => <div className='relative w-20 h-20'>
                <Image src={record.image} ></Image>
            </div>,
            className: 'bg-white text-center border',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            className: 'border',

            render: (_, record: any) => <div className='text-blue-500 text-center cursor-pointer' onClick={() => { setIsOpenModalUpdateCategory(true); setId(record._id) }}>Update</div>,
        },
    ];

    const requestDataProduct = async () => {
        const data = await POST_ADMIN('/admin/listProduct', { skip: (currentPage - 1) * pageSize, limit: 5, key });
        if (data.result) {
            data.data.forEach((item: any) => item.key = item._id);
            setCount(data.count)
            return data.data
        }
    }

    const queryClient = useQueryClient()

    const query = useQuery({ queryKey: ['listProductForAdmin'], queryFn: requestDataProduct })

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
            const response = await POST_ADMIN('/admin/deleteProduct', { _id: selectedRowKeys });
            if (response.result) {
                toast('delete product success');
                queryClient.invalidateQueries({ queryKey: ['listCategory'] })
                queryClient.invalidateQueries({ queryKey: ['listProductForAdmin'] })
            }
        }
    }

    const handleChangePage = (page: any, pageSize: any) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["listProductForAdmin"] });
    }, [currentPage, pageSize, key]);
    return (
        <div className='w-[98%] mr-5 mt-2'>
            <div className='text-2xl font-semibold'>List Product</div>
            <div className="w-full flex justify-end">
                <input type="text" className="px-3 py-3 w-[350px] mt-3 outline-none mb-3 border" placeholder="Nhập vào gì đó" onChange={(e) => setKey(e.target.value)} />
            </div>
            <Table bordered rowSelection={rowSelection} columns={columns} dataSource={query.data} pagination={{
                total: count, current: currentPage,
                pageSize: pageSize,
                showSizeChanger: false,
                pageSizeOptions: ['10', '20', '30'],
                onChange: handleChangePage,

            }} className='rounded-2xl' />
            <div className='mt-[-60px] border rounded z-50 relative bg-white p-3 w-max cursor-pointer' onClick={() => handleDelete()}>Delete</div>
            <ModalUpdateProduct isOpenModalLogin={isOpenModalUpdateCategory} setIsOpenModalLogin={setIsOpenModalUpdateCategory} id={id}></ModalUpdateProduct>
        </div>
    );
};

export default App;