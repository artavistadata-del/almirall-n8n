import { Shield, TrendingUp, Mail, Lock, User } from 'lucide-react';
import Image from 'next/image';
import { UserRole } from '@/types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#eef2f6]">
      {/* Abstract Background Gradient Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400 opacity-20 blur-[120px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-almirall-accent opacity-30 blur-[120px] rounded-full pointer-events-none animate-float-delayed"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-300 opacity-20 blur-[100px] rounded-full pointer-events-none animate-float-slow"></div>

      <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 xl:gap-40 relative z-10">
        
        {/* Left Side: Brand & Concept */}
        <div className="w-full max-w-[500px] text-center lg:text-left space-y-6">
          <div className="inline-flex items-center justify-center bg-almirall-primary p-2 px-4 shadow-md mb-2">
            <Image 
              src="/almirall-logo-white.svg" 
              alt="Almirall Logo" 
              width={100} 
              height={30} 
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-almirall-primary tracking-tight">
            DermSupply <span className="text-almirall-accent font-light">Hub</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto lg:mx-0">
            Advanced Order Management & Inventory Monitoring Hub for distribution centers.
          </p>
        </div>

        {/* Right Side: Login Card matching reference image */}
        <div className="w-full max-w-[420px] relative mt-8 lg:mt-0">
          
          {/* Character Image Overriding the Card */}
          <div className="absolute -right-36 -bottom-10 w-64 h-80 z-20 pointer-events-none hidden md:block transform -scale-x-100">
            <Image
              src="/char.png"
              alt="Almirall Character"
              fill
              className="object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)]"
            />
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 relative z-10">
            
            <div className="text-center mb-8">
              <h2 className="text-[26px] font-bold text-gray-900 mb-2 tracking-tight">Sign in with email</h2>
              <p className="text-gray-500 text-[14px] leading-relaxed">
                Select your role to access the warehouse dashboard and manage inventory.
              </p>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  readOnly
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f5f7f9] border border-transparent rounded-[14px] text-gray-500 text-[15px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all cursor-not-allowed"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  readOnly
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f5f7f9] border border-transparent rounded-[14px] text-gray-500 text-[15px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <Shield size={16} />
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <button className="text-[13px] text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-not-allowed">
                Forgot password?
              </button>
            </div>

            <button
              onClick={() => onLogin('admin')}
              className="w-full bg-[#1c1c1e] hover:bg-black text-white py-4 rounded-[14px] font-semibold text-[15px] transition-all shadow-md active:scale-[0.98]"
            >
              Sign In
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
