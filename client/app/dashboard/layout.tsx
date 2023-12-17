"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Router from "next/router";
import Loader from "../components/Loading";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const delay = (s) => new Promise(resolve => setTimeout(resolve, s));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", () => {
      setIsLoading(false);
    });
  }, [Router]);

  useEffect(() => {
    // Fetch the username from localStorage on the client side
    const storedUsername = localStorage.getItem("User") || "";
    setUsername(storedUsername);
  }, []);

  const handleLogout = async () => {
    try {
      // Send a request to the server to log the user out
      setIsLoading(true);
      await delay(1000);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to the login page after successful logout
        localStorage.removeItem("User");
        setUsername("");
        router.push("/");
      } else {
        // Handle logout failure, display an error message or redirect as needed
        console.error("Logout failed");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="w-full h-full">
      {isLoading && <Loader />}
      <div className="h-full w-full relative bg-gray-200 p-2">
        <aside className="absolute w-full sm:w-[200px] top-0 left-0 h-[60px] sm:h-full border-b sm:border-r border-black/10">
          <Link href="/dashboard">
            <h1 className="text-5xl sm:text-5xl text-blue-950 mb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-800 from-sky-400 m-1">
              Short Links
            </h1>
          </Link>
        </aside>
        <div className="mt-[60px] sm:ml-[200px] h-full">
          <header className="h-[40px] sm:h-[40px] border-b border-black/10">
            <div className="h-full w-full flex items-center justify-end">
              <div className="flex items-center">
                user: <h1 className="text-blue-400 ml-1 mr-2"> {username}</h1>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-blue-500 text-blue-500 py-2 px-4 rounded hover:bg-gray-300 mb-2"
              >
                Log Out
              </button>
            </div>
          </header>
          <div className="h-[calc(100vh-120px)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
