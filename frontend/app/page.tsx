"use client";
import { useUserContext } from "@/context/userContext";

export default function Home() {
  const { logoutUser } = useUserContext();
  const name = "samiksha";
  return (
    <main className="py-[2rem] mx-[10-rem]">
      <header className="flex justify-between">
        <h1 className="text-[2rem]">
          Hey there <span className="text-red-600">{name}</span>, welcome to le
          authorization
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </header>
    </main>
  );
}
