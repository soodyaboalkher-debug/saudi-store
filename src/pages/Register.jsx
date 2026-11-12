
import { useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email:cleanEmail,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setSuccess("Account created! Please check your email to confirm your account.");
      }

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#F7F5F0]">

      {/* IMAGE SIDE */}

      <div
        className="hidden md:flex relative min-h-screen bg-cover bg-center bg-no-repeat
        bg-[url('/YOUR-REGISTER-IMAGE.jpg')]"
      >

        <div className="absolute inset-0 bg-black/15" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

          <Link
            to="/"
            className="font-serif text-3xl tracking-[0.25em]"
          >
            SAUDI
          </Link>

          <div>

            <p className="text-[10px] tracking-[0.4em] mb-6">
              THE SAUDI EXPERIENCE
            </p>

            <h2 className="font-serif text-5xl leading-tight max-w-md">
              Define Your
              <br />
              Own Style.
            </h2>

            <p className="text-sm text-white/80 mt-6 max-w-xs leading-7">
              Discover timeless essentials designed
              for a modern identity.
            </p>

          </div>

          <p className="text-[9px] tracking-[0.3em]">
            SAUDI COLLECTION © 2026
          </p>

        </div>
      </div>


      {/* FORM SIDE */}

      <div className="min-h-screen flex items-center justify-center px-7 py-14 sm:px-12 lg:px-20">

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}

          <Link
            to="/"
            className="md:hidden block text-center font-serif text-3xl tracking-[0.25em] mb-12 text-[#171717]"
          >
            SAUDI
          </Link>


          {/* HEADING */}

          <div className="mb-10">

            <p className="text-[10px] tracking-[0.35em] text-[#A39585] mb-5">
              JOIN THE COLLECTION
            </p>

            <h1 className="font-serif text-4xl md:text-5xl text-[#171717] mb-4">
              Create Account
            </h1>

            <p className="text-sm text-[#737373] leading-6">
              Become part of SAUDI and discover
              a more refined approach to everyday style.
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleRegister} className="space-y-7">

            {/* EMAIL */}

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
                className="w-full bg-transparent border-b border-[#D8D1C7] py-4 text-sm text-[#171717] outline-none transition-all placeholder:text-[#B0AAA1] focus:border-[#171717]"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-[10px] tracking-[0.2em] text-[#555] mb-3">
                PASSWORD
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent border-b border-[#D8D1C7] py-4 text-sm text-[#171717] outline-none transition-all placeholder:text-[#B0AAA1] focus:border-[#171717]"
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-[10px] tracking-[0.2em] text-[#555] mb-3">
                CONFIRM PASSWORD
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent border-b border-[#D8D1C7] py-4 text-sm text-[#171717] outline-none transition-all placeholder:text-[#B0AAA1] focus:border-[#171717]"
              />

            </div>


            {/* ERROR */}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3">
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p className="text-xs text-green-700 bg-green-50 p-3 leading-6">
                {success}
              </p>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171717] text-white py-4 text-[10px] tracking-[0.3em] transition-all duration-300 hover:bg-[#A39585] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>

          </form>


          {/* LOGIN LINK */}

          <div className="mt-9 text-center">

            <p className="text-xs text-[#777]">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-[#171717] font-medium underline underline-offset-4 hover:text-[#A39585] transition"
              >
                Sign In
              </Link>

            </p>

          </div>


          {/* BACK TO STORE */}

          <div className="mt-14 text-center">

            <Link
              to="/"
              className="text-[9px] tracking-[0.25em] text-[#999] hover:text-[#171717] transition"
            >
              BACK TO STORE
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
