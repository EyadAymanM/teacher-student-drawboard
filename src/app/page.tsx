import { redirect } from "next/navigation";

export default function Home() {
  const createRoom = async() => {
    'use server'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const roomId = [...Array(11)].map(() => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');

    redirect(`/draw/${roomId}`);
  };
  const logout = async() => {
    'use server'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const roomId = [...Array(11)].map(() => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');

    redirect(`/room/${roomId}`);
  };
  return (
    <div className="">

      <div className="container flex flex-col gap-20 items-center pt-30">

        <h3 className="text-4xl font-mono select-none ">Welcome Teacher</h3>
        <div className="flex w-[450px] justify-around">
          <form action={createRoom}>
            <button className="w-28 h-12 border rounded cursor-pointer hover:bg-[#b7d3b0] hover:text-white">Create Board</button>
          </form>
          <form action={logout}>
            <button className="w-28 h-12 border rounded cursor-pointer hover:bg-[#ffcaca] hover:text-white">logout</button>
          </form>
          
        </div>

      </div>

    </div>
  );
}
