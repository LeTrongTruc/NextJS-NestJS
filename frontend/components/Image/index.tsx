import Image from "next/image";
export interface ComponentProps {
    src: string;
    attribute?: string;
}
const Imagee: React.FC<ComponentProps> = ({ src, attribute }) => {
    return (<>
        <img src={src} className={`w-full h-full ${attribute}`} alt="Picture of the author" onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "/images.png";
        }}></img>
    </>)
}
export default Imagee