'use client'
import Image from '@/components/Image';
import { useState } from 'react';
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

export interface ComponentProps {
    nameCategory: string;
    product: object;
}

const IconFavorite: React.FC<ComponentProps> = ({ }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <>
            {hovered ? <MdFavorite className='text-red-500' /> : <MdFavoriteBorder />}
        </>
    )
}
export default IconFavorite;