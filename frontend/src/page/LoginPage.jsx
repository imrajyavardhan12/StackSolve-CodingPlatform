import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from 'react-router-dom';
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Zap,
  Target,
  Trophy
} from "lucide-react";

import { z } from "zod";
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
});

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-navy via-dark-surface to-dark-navy relative overflow-hidden'>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-0 w-1/3 h-1/3 bg-primary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 right-0 w-1/4 h-1/4 bg-secondary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-float"></div>
      </div>

      <div className='min-h-screen grid lg:grid-cols-2 relative z-10'>
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 transition-all duration-300">
                  <Code className="w-8 h-8 text-dark-navy" />
                </div>
                <h1 className="text-3xl font-black gradient-text mt-4">Welcome Back</h1>
                <p className="text-gray-300">Ready to continue your coding journey?</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-white">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`input input-bordered w-full pl-10 glass-effect border-primary/20 text-white placeholder-gray-400 focus:border-primary ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-white">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`input input-bordered w-full pl-10 pr-10 glass-effect border-primary/20 text-white placeholder-gray-400 focus:border-primary ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-lg bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-bold w-full rounded-xl"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-gray-400">OR</div>

            {/* Sign Up Link */}
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-gray-300 mb-4">
                New to StackSolve?
              </p>
              <Link 
                to="/signup" 
                className="btn btn-outline border-primary text-primary hover:bg-primary/10 hover:border-primary hover:text-primary font-bold w-full rounded-xl transition-all duration-300"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="max-w-lg space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black mb-4">
                <span className="gradient-text">Master DSA</span>
                <br />
                <span className="gradient-text-primary">Ace Interviews</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Join thousands of developers preparing for their dream jobs
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">1000+ Problems</h3>
                    <p className="text-sm text-gray-400">Curated from top tech companies</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Real-time Execution</h3>
                    <p className="text-sm text-gray-400">Code and test instantly</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Track Progress</h3>
                    <p className="text-sm text-gray-400">Detailed analytics & insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="mockup-code glass-effect text-left animate-glow">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-xs ml-4">solution.js</span>
              </div>
              <div className="px-4 py-3 text-xs">
                <div><span className="code-primary">const</span> <span className="code-secondary">solve</span> = () => &#123;</div>
                <div>&nbsp;&nbsp;<span className="code-primary">return</span> <span className="code-success">"success"</span>;</div>
                <div>&#125;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;