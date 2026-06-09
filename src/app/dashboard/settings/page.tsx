'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, User, Bell, Lock, Globe, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function SettingsPage() {
  const { userRole } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState(userRole === 'admin' ? 'Ferra' : 'Manager');
  const [lastName, setLastName] = useState(userRole === 'admin' ? 'Alexandra' : 'User');
  const [email, setEmail] = useState(userRole === 'admin' ? 'ferra.alexandra@almirall.com' : 'manager@almirall.com');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update defaults if userRole changes
  useEffect(() => {
    setFirstName(userRole === 'admin' ? 'Ferra' : 'Manager');
    setLastName(userRole === 'admin' ? 'Alexandra' : 'User');
    setEmail(userRole === 'admin' ? 'ferra.alexandra@almirall.com' : 'manager@almirall.com');
  }, [userRole]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 text-almirall-primary rounded-2xl">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account preferences and settings</p>
        </div>
      </div>

      <div className="max-w-2xl mt-8 relative">
        {/* Success Toast */}
        {showSuccess && (
          <div className="absolute -top-16 left-0 right-0 mx-auto w-max flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl shadow-sm border border-green-100 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Profile updated successfully!</span>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-2xl shadow-sm">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/gif" />
                <button 
                  type="button"
                  onClick={handleAvatarClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors mb-2"
                >
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <input type="text" value={userRole === 'admin' ? 'Administrator' : 'Store Manager'} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
              </div>

              <div className="flex justify-end mt-4 pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm flex items-center gap-2 transition-all ${
                    isSaving ? 'bg-blue-400 cursor-wait' : 'bg-almirall-primary hover:bg-almirall-primary/90'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
