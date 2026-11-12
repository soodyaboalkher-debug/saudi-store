
import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



return (
  <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#F7F5F0] mt-20">

    {/* IMAGE SIDE */}
    <div
      className="hidden md:flex relative min-h-screen bg-cover bg-center bg-no-repeat
      bg-[url('/khalaf.jpg')]"
    >
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

        <Link to="/" className="font-serif text-3xl tracking-[0.25em]">
          SAUDI
        </Link>

        <div>
          <p className="text-[10px] tracking-[0.35em] mb-5">
            MODERN ESSENTIALS
          </p>

          <h2 className="font-serif text-5xl leading-tight max-w-md">
            Timeless Style.
            <br />
            Modern Identity.
          </h2>
        </div>

        <p className="text-[9px] tracking-[0.25em]">
          SAUDI COLLECTION © 2026
        </p>

      </div>
    </div>


    {/* FORM SIDE */}
    <div className="min-h-screen flex items-center justify-center px-7 py-14 sm:px-12 lg:px-20">

      <div className="w-full max-w-md">

        <Link
          to="/"
          className="md:hidden block text-center font-serif text-3xl tracking-[0.25em] mb-14 text-[#171717]"
        >
          SAUDI
        </Link>

        <div className="mb-12">

          <p className="text-[10px] tracking-[0.35em] text-[#A39585] mb-5">
            WELCOME BACK
          </p>

          <h1 className="font-serif text-4xl md:text-5xl text-[#171717] mb-4">
            Sign In
          </h1>

          <p className="text-sm text-[#737373]">
            Welcome back. Please enter your details.
          </p>

        </div>


        <form onSubmit={handleLogin} className="space-y-8">

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#555] mb-3">
              EMAIL ADDRESS
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#D8D1C7] py-4 text-sm outline-none transition-all placeholder:text-[#B0AAA1] focus:border-[#171717]"
            />
          </div>


          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#555] mb-3">
              PASSWORD
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#D8D1C7] py-4 text-sm outline-none transition-all placeholder:text-[#B0AAA1] focus:border-[#171717]"
            />
          </div>


          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-3">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] text-white py-4 text-[10px] tracking-[0.3em] transition-all duration-300 hover:bg-[#39352F] disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

        </form>


        <div className="mt-10 text-center">
          <p className="text-xs text-[#777]">
            Don't have an account?

            <Link
              to="/register"
              className="ml-2 text-[#171717] font-medium underline underline-offset-4 hover:text-[#A39585] transition"
            >
              Create Account
            </Link>
          </p>
        </div>


        <div className="mt-16 text-center">
          <Link
            to="/"
            className="text-[9px] tracking-[0.2em] text-[#999] hover:text-[#171717] transition"
          >
            BACK TO STORE
          </Link>
        </div>

      </div>
    </div>

  </div>
);


}
