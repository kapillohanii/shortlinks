const CookieError = () => {
    return (
        <div className="w-full h-screen absolute bg-[rgb(0,0,0,0.3)] backdrop-blur-[10px] flex justify-center items-center z-[99] left-0 top-0">
            <div className="container border border-red-800 rounded-lg p-5  text-white font-bold">
                 <p> <p className="text-red-700">Cookie error:</p> This website works using third party cookies and your browser doesn't allow them. Check browser's privacy settings or use a different browser.</p>
      </div>
        </div>
     );
}

export default CookieError;