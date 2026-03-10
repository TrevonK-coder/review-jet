
import { Send, MousePointerClick, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';

const Dashboard = () => {
    const metrics = useStore((state) => state.metrics);
    const customers = useStore((state) => state.customers);
    const businessName = useStore((state) => state.businessName);

    const ctr = metrics.totalSent > 0
        ? Math.round((metrics.clicks / metrics.totalSent) * 100)
        : 0;

    const recentActivity = customers.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                {!businessName && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Finish Setup in Settings
                    </span>
                )}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <Send className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Requests Sent</p>
                            <h3 className="text-2xl font-bold text-slate-900">{metrics.totalSent}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-emerald-100 p-3 rounded-xl">
                            <MousePointerClick className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Link Click-Through Rate</p>
                            <div className="flex items-baseline space-x-2">
                                <h3 className="text-2xl font-bold text-slate-900">{ctr}%</h3>
                                <span className="text-xs text-slate-500 font-medium">{metrics.clicks} clicks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                    <Clock size={18} className="text-slate-400" />
                </div>
                <div className="p-0">
                    {recentActivity.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <p>No activity yet. Send some review requests!</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recentActivity.map((customer) => (
                                <li key={customer.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-slate-100 p-2 rounded-full">
                                            <CheckCircle2 size={20} className={customer.status === 'sent' ? 'text-emerald-500' : 'text-amber-500'} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                                {customer.status === 'sent' ? 'Request sent to' :
                                                    customer.status === 'offer_sent' ? 'Offer sent to' :
                                                        'Added '}
                                                <span className="font-bold">{customer.name}</span>
                                                {customer.visitCount > 1 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-widest hidden sm:inline-block">
                                                        Return Client
                                                    </span>
                                                )}
                                            </p>
                                            {customer.service && (
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {customer.service} (Visits: {customer.visitCount})
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(customer.createdAt).toLocaleDateString()} at {new Date(customer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'sent' ? 'bg-emerald-100 text-emerald-800' :
                                                customer.status === 'offer_sent' ? 'bg-indigo-100 text-indigo-800' :
                                                    customer.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-slate-100 text-slate-800'
                                            }`}>
                                            {customer.status === 'offer_sent' ? 'Offer Sent' :
                                                customer.status === 'sent' ? 'Review Sent' :
                                                    customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
