
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, CreditCard, LogOut, Send } from 'lucide-react';
import { useStore } from '../store';
import Assistant from './Assistant';

const Layout = () => {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);
    const businessName = useStore((state) => state.businessName);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/customers', icon: Users, label: 'Customers' },
        { to: '/settings', icon: Settings, label: 'Settings' },
        { to: '/billing', icon: CreditCard, label: 'Billing' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl">
                <div className="p-6 flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Send size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ReviewJet</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="px-4 py-3 mb-2 rounded-xl bg-slate-800">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Business</p>
                        <p className="text-sm font-medium truncate">{businessName || 'Not configured'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                        <div className="bg-emerald-500 p-1.5 rounded-md">
                            <Send size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">ReviewJet</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-600 p-2">
                        <LogOut size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 w-full bg-slate-900 text-white border-t border-slate-800 flex justify-around p-3 pb-safe">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-emerald-400' : 'text-slate-400'
                                }`
                            }
                        >
                            <item.icon size={20} className="mb-1" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </main>

            <Assistant />
        </div>
    );
};

export default Layout;
