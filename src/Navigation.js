export default function Navbar(){
    return(
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className=" hidden md:flex space-x-4">
                    <li className="text-white"><a href="#index"></a>Home</li>
                    <li className="text-white">Users</li>
                </ul>
                <button className="md:hidden text-white">≡</button>
            </div>
        </nav>
    );
}