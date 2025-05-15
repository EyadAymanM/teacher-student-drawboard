'use client'
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'

const Register = () => {
  const router = useRouter();
  // setting states for email & password 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState("");
  // using navigate function for getting to home page if authenticated

  // login function 
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const register = async () => {

        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password:pwd }),
        });

        if (response.ok) {
          router.push("/auth/login");
        } else {
          const data = await response.json();
          setError(data.message || "Registration failed");
        }

    }
    register();
  };

  return (
    <section className="w-screen h-screen bg-[#FAF9F9] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-84 bg-[#bebebebd] p-10 pb-8 flex flex-col gap-4 rounded-lg shadow-xl font-josefin">

        <h1 className="text-4xl text-center font-josefin font-bold text-gray-600 select-none text-shadow">Teacher&apos;s Board</h1>

        {/* Error Feild */}
        {error &&
          <p className="text-lg text-center font-josefin font-bold text-red-600 select-none ">{error}</p>
        }


        {/* Name Feild */}
        <div className="flex flex-col ">
          <label htmlFor="name">Name</label>
          <input
            onChange={((e: ChangeEvent<HTMLInputElement>) => setName(e.target.value))}
            type="text"
            required
            placeholder="John Doe"
            name="name"
            id="name"
            className="border border-[#89B0AE] bg-[#FAF9F9] focus:outline-[#89B0AE] py-1 px-2 placeholder:text-gray-400"
          />
        </div>

        {/* E-mail Feild */}
        <div className="flex flex-col ">
          <label htmlFor="email">E-mail</label>
          <input
            onChange={((e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value))}
            type="email"
            required
            placeholder="example@domain.com"
            name="email"
            id="email"
            className="border border-[#89B0AE] bg-[#FAF9F9] focus:outline-[#89B0AE] py-1 px-2 placeholder:text-gray-400"
          />
        </div>

        {/* Password Feild */}
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            onChange={((e: ChangeEvent<HTMLInputElement>) => setPwd(e.target.value))}
            type="password"
            required
            placeholder="••••••••"
            name="password"
            id="password"
            className="border border-[#89B0AE] bg-[#FAF9F9] focus:outline-[#89B0AE] py-1 px-2 placeholder:text-gray-400"
          />
        </div>


        {/* Login Button */}
        <input
          type="submit"
          value="Register"
          className="border border-[#000000] text-[#555B6E] w-fit px-6 self-center py-1 rounded-sm bg-[#FAF9F9] hover:bg-[#5f6867] hover:text-[#FAF9F9] hover:cursor-pointer duration-100"
        />
      </form>
    </section>
  );
};
export default Register;
