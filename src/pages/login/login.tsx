import { useState } from "react";
import { Dumbbell, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../../service/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Welcome back!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0b0b0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#151517] border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4">
              <Dumbbell className="w-9 h-9 text-black" />
            </div>
            <h1 className="text-white text-2xl font-bold mb-1">
              AB Fitness Center
            </h1>
            <p className="text-gray-400 text-sm">Management Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@gmail.com"
                  className="w-full bg-[#0b0b0d] border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0b0b0d] border border-gray-800 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:border-yellow-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-yellow-500"
              />
              <span className="text-sm text-gray-400">Remember Me</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg font-semibold shadow-lg shadow-yellow-500/20 hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
