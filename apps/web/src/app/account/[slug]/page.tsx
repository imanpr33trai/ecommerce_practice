"use client"
import React, { useState, useEffect } from 'react';
import { Package, CreditCard, MapPin, Settings, LogOut, User, Bell, ChevronRight, LayoutDashboard, Heart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import BentoCard from '@/components/ui/BentoCard';
import Button from '@/components/ui/Button';
import ModalAddress from '@/components/ModalAddress';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function AccountPage() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { wishlist } = useShop();
  const navigate = useRouter();
  const location = usePathname();

  // Determine active tab from URL. Default to 'overview' if path is just '/account'
  const currentPath = location.split('/').pop();
  const activeTab = currentPath === 'account' ? 'overview' : currentPath;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate.push('/log-in');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate.push('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/account' },
    { id: 'orders', label: 'Orders', icon: Package, path: '/account/orders' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/account/addresses' },
    { id: 'payment', label: 'Payment', icon: CreditCard, path: '/account/payment' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/account/settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
           <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-light mb-6">Order History</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                   <BentoCard key={order} className="p-6 bg-white flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                         <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=150" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 w-full text-center md:text-left">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-lg">Order #245{order}</h4>
                            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Delivered</span>
                         </div>
                         <p className="text-sm text-gray-500 mb-2">Placed on Oct 12, 2023</p>
                         <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">$508.00</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>2 Items</span>
                         </div>
                      </div>
                      <Button variant="secondary">View Details</Button>
                   </BentoCard>
                ))}
              </div>
           </div>
        );
      case 'addresses':
         return (
           <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end mb-4">
                 <h2 className="text-3xl font-light">Saved Addresses</h2>
                 <Button size="sm" onClick={() => setIsAddressModalOpen(true)}>Add New</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <BentoCard className="p-6 bg-white border-2 border-black relative">
                    <span className="absolute top-4 right-4 text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full">DEFAULT</span>
                    <h3 className="font-bold mb-2">Home</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                       {user.name} <br/>
                       123 Maple Avenue, Apt 4B <br/>
                       New York, NY 10012 <br/>
                       United States
                    </p>
                    <div className="flex gap-2">
                       <button className="text-xs font-bold underline" onClick={() => setIsAddressModalOpen(true)}>Edit</button>
                       <button className="text-xs font-bold text-red-500 underline">Remove</button>
                    </div>
                 </BentoCard>
                 <BentoCard
                    className="p-6 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsAddressModalOpen(true)}
                 >
                    <div className="text-center">
                       <div className="w-10 h-10 rounded-full bg-white mx-auto mb-2 flex items-center justify-center shadow-sm">+</div>
                       <span className="font-bold text-sm text-gray-500">Add Address</span>
                    </div>
                 </BentoCard>
              </div>
           </div>
         );
      case 'settings':
         return (
            <div className="space-y-6 animate-fade-in">
               <h2 className="text-3xl font-light mb-6">Account Settings</h2>
               <BentoCard className="p-8 bg-white max-w-2xl">
                  <h3 className="font-bold mb-6">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                        <input type="text" defaultValue={user.name.split(' ')[0]} className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                        <input type="text" defaultValue={user.name.split(' ')[1] || ''} className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" />
                     </div>
                  </div>
                  <div className="mb-8">
                     <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                     <input type="email" defaultValue={user.email} className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <Button>Save Changes</Button>
               </BentoCard>

               <BentoCard className="p-8 bg-white max-w-2xl flex items-center justify-between">
                  <div>
                     <h3 className="font-bold mb-1">Email Notifications</h3>
                     <p className="text-sm text-gray-500">Receive updates about your orders and promotions.</p>
                  </div>
                  <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
               </BentoCard>
            </div>
         );
      case 'payment':
         return (
            <div className="space-y-6 animate-fade-in">
               <h2 className="text-3xl font-light mb-6">Payment Methods</h2>
               <div className="bg-white rounded-[2rem] p-8 border border-dashed border-gray-300 flex items-center justify-center min-h-[200px]">
                  <p className="text-gray-500">No payment methods saved.</p>
               </div>
            </div>
         );
      default: // Overview
        return (
           <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <BentoCard className="p-6 bg-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                       <Package size={24} />
                    </div>
                    <div>
                       <span className="block text-2xl font-bold">12</span>
                       <span className="text-xs text-gray-500 uppercase tracking-wider">Total Orders</span>
                    </div>
                 </BentoCard>
                 <BentoCard className="p-6 bg-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                       <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                       <span className="block text-2xl font-bold">{wishlist.length}</span>
                       <span className="text-xs text-gray-500 uppercase tracking-wider">Wishlist Items</span>
                    </div>
                 </BentoCard>
                 <BentoCard className="p-6 bg-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                       <Bell size={24} />
                    </div>
                    <div>
                       <span className="block text-2xl font-bold">2</span>
                       <span className="text-xs text-gray-500 uppercase tracking-wider">Notifications</span>
                    </div>
                 </BentoCard>
              </div>

              <div>
                 <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold">Recent Order</h3>
                    <Link href="/account/orders" className="text-sm text-gray-500 hover:text-black">View All</Link>
                 </div>
                 <BentoCard className="p-6 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                       <div className="flex items-center gap-4 w-full">
                          <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=150" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                          <div>
                             <h4 className="font-bold">Long Chair</h4>
                             <p className="text-sm text-gray-500">Delivered yesterday</p>
                          </div>
                       </div>
                       <Button variant="outline" className="w-full md:w-auto">Track Order</Button>
                    </div>
                 </BentoCard>
              </div>
           </div>
        );
    }
  };

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto pb-12 min-h-screen">
      <Breadcrumbs />
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-light mb-2">Hello, {user.name}</h1>
          <p className="text-gray-500">Manage your orders and preferences.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50">
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="w-full md:w-72 shrink-0 space-y-8">
           <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h2 className="font-bold leading-tight">{user.name}</h2>
                 <p className="text-xs text-gray-500">{user.email}</p>
              </div>
           </div>

           <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                 <Link
                    key={item.id}
                    href={item.path}
                    className={`
                       flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group
                       ${activeTab === item.id || (activeTab === 'overview' && item.id === 'overview') ? 'bg-black text-white shadow-lg' : 'hover:bg-white text-gray-600'}
                    `}
                 >
                    <div className="flex items-center gap-3">
                       <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-black'} />
                       <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={16} />}
                 </Link>
              ))}

              <div className="h-px bg-gray-200 my-2 mx-4"></div>

              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-500 transition-colors">
                 <LogOut size={20} />
                 <span className="font-medium text-sm">Sign Out</span>
              </button>
           </nav>
        </aside>

        <main className="flex-1">
           {renderContent()}
        </main>

      </div>

      <ModalAddress isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </div>
  );
}