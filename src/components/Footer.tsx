import React from "react";

function Footer() {
    return (
        <>
            <footer className="bg-gray-800 text-white py-6">
                <div className=" max-w-300 mx-auto text-center">
                    <p>© {new Date().getFullYear()} Ваша компания. Все права защищены.</p>
                </div>
            </footer>
        </>
    );
}

export default Footer;
