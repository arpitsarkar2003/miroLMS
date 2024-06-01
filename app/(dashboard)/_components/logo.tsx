import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return ( 
        <div>
            <Link href="/" className="flex items-center gap-1">
            <Image 
                src="/logo.svg"
                alt="logo"
                width={50}
                height={50}
            />
            <p className="text-3xl font-bold">Miro</p>
            </Link>
            
        </div>
     );
}
 
export default Logo;