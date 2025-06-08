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
  User,
  Zap,
  Target,
  Trophy,
  Users
} from "lucide-react";

import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
  name: z.string().min(3, "Name must be atleast 3 character")
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema)
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
    } catch (error) {
      console.error("SignUp failed:", error);
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
        {/* Left Side - SignUp Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 transition-all duration-300">
                  <Code className="w-8 h-8 text-dark-navy" />
                </div>
                <h1 className="text-3xl font-black gradient-text mt-4">Join StackSolve</h1>
                <p className="text-gray-300">Start your coding journey today</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-white">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("name")}
                    className={`input input-bordered w-full pl-10 glass-effect border-primary/20 text-white placeholder-gray-400 focus:border-primary ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

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
                disabled={isSigninUp}
              >
                {isSigninUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-gray-400">OR</div>

            {/* Sign In Link */}
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-gray-300 mb-4">
                Already have an account?
              </p>
              <Link 
                to="/login" 
                className="btn btn-outline border-primary text-primary hover:bg-primary/10 hover:border-primary hover:text-primary font-bold w-full rounded-xl transition-all duration-300"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="max-w-lg space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black mb-4">
                <span className="gradient-text">Start Your</span>
                <br />
                <span className="gradient-text-primary">Coding Journey</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Join our community of passionate developers
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">10K+</h3>
                <p className="text-sm text-gray-400">Active Developers</p>
              </div>

              <div className="glass-effect rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <Code className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">1000+</h3>
                <p className="text-sm text-gray-400">DSA Problems</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Track your progress with detailed analytics</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Build coding streaks and stay motivated</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Prepare for interviews at top tech companies</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="glass-effect rounded-xl p-6 mt-8">
              <p className="text-gray-300 italic text-sm mb-4">
                "StackSolve helped me crack interviews at multiple FAANG companies. The platform's problem curation is simply amazing!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                <div>
                  <p className="text-white font-semibold text-sm">Priya Sharma</p>
                  <p className="text-gray-400 text-xs">Software Engineer at Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;