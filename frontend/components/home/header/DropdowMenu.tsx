'use client';
import React, { ReactNode } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, Menu, Space } from 'antd';
import { useRouter } from "next/navigation";

const App = ({ dataCategory }: any) => {
  const items = [...dataCategory.data]
  const router = useRouter();

  const handleItemClick = (event: { key: any; }) => {
    console.log('Item clicked:', event.key);
    // Thực hiện các xử lý khác tùy theo key của item được click
  };

  const renderMenuItem = (item: any) => {
    if (item.children) {
      return (
        <Menu.SubMenu className='py-5 w-40 h-16' key={item.key} title={item.label}>
          {item.children.map((childItem: any) => (
            <Menu.Item className='p-5 w-40 h-16' key={childItem.key} onClick={()=>router.push(`/Search?category=${childItem.label}-${childItem.key}`)}>{childItem.label}</Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    } else {
      return <Menu.Item className='p-5 w-40 h-16' key={item.key} onClick={()=>router.push(`/Search?category=${item.label}-${item.key}`)}>{item.label}</Menu.Item>;
    }
  };

  const menu = (
    <Menu onClick={handleItemClick}>
      {items.map((item) => renderMenuItem(item))}
    </Menu>
  );



  return (
    <>

      {dataCategory?.data && <Dropdown
        menu={{ items }}
        dropdownRender={(menus: ReactNode) => menu}
      >
        <a onClick={(e) => e.preventDefault()} >
          <Space>
            Sản phẩm
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>}
    </>

  );
}
export default App;