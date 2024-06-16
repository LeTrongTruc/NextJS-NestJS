import { POST_ADMIN } from '@/components/common';
import { Table } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';


function XLSXReader() {
    const [data, setData] = useState<any>([]);
    const columns = [
        {
            title: 'CategoryID',
            dataIndex: 'CategoryID',
        },
        {
            title: 'Name',
            dataIndex: 'Name',
        },
        {
            title: 'Detail',
            dataIndex: 'Detail',
            render: (_: any, record: any) => <div className=''>
                {record.Detail}
            </div>,

        },
        {
            title: 'Specification',
            dataIndex: 'Specification',
        },
        {
            title: 'Standard',
            dataIndex: 'Standard',
        },
        {
            title: 'Unit',
            dataIndex: 'Unit',
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
        },
        {
            title: 'Image',
            render: (_: any, record: any) => <div className='w-32 overflow-scroll'>
                {record.Image}
            </div>,
        },
    ];
    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const fileData = e.target.result;
            const workbook = XLSX.read(fileData, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            const firstSheetName = sheetNames[0];
            const firstSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            setData(firstSheetData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        const response = await POST_ADMIN('/admin/importProduct', data);
        if (response.result) {
            toast('Upload product success');
            setData([])
        }

    }

    return (
        <div className='w-[97%]  ml-5'>
            <div className='flex justify-between mb-2 mt-2 '>
                <input type="file" onChange={handleFileChange} />
                <div onClick={() => handleUpload()} className='border rounded-xl p-3 bg-green-500 text-white text-base cursor-pointer font-medium'>
                    Upload
                </div>
            </div>
            <Table bordered columns={columns} dataSource={data} />
        </div>
    );
}

export default XLSXReader;