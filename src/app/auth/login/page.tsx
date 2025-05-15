'use client'
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  // setting states for email & password 
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState("");
  // using navigate function for getting to home page if authenticated

  // login function 
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const login = async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password: pwd,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid credentials");
          return;
        }

        router.push("/");
        router.refresh();
      } catch (error) {
        console.log(error)
      }

    }
    login();
  };

  return (
    <section className="w-screen h-screen bg-[#FAF9F9] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-84 bg-[#bebebebd] p-10 pb-8 flex flex-col gap-4 rounded-lg shadow-xl font-josefin">

        <h1 className="text-4xl text-center font-josefin font-bold text-gray-600 select-none text-shadow">Teacher&apos;s Board</h1>

        {/* Error Feild */}
        {error &&
          <p className="text-4xl text-center font-josefin font-bold text-red-600 select-none ">{error}</p>
        }


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
          value="Log in"
          className="border border-[#000000] text-[#555B6E] w-fit px-6 self-center py-1 rounded-sm bg-[#FAF9F9] hover:bg-[#5f6867] hover:text-[#FAF9F9] hover:cursor-pointer duration-100"
        />
      </form>
    </section>
  );
};
export default Login;
