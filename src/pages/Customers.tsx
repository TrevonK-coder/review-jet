import React, { useState } from 'react';
import { useStore } from '../store';
import { Send, UserPlus, Search, Phone, History } from 'lucide-react';
import { toast } from 'sonner';

const Customers = () => {
    const customers = useStore((state) => state.customers);
    const addCustomer = useStore((state) => state.addCustomer);
    const sendReviewRequest = useStore((state) => state.sendReviewRequest);
    const sendOfferRequest = useStore((state) => state.sendOfferRequest);
    const placeId = useStore((state) => state.placeId);
    const businessName = useStore((state) => state.businessName);

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newService, setNewService] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newPhone) return;

        addCustomer({ name: newName, phone: newPhone, service: newService });
        setNewName('');
        setNewPhone('');
        setNewService('');
        setIsAdding(false);
        toast.success('Customer added successfully!');
    };

    const handleSend = (customerId: string, customerName: string, type: 'review' | 'offer') => {
        if (!placeId || !businessName) {
            toast.error('Please configure your Setup in Settings first.');
            return;
        }

        const isOffer = type === 'offer';
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));

        toast.promise(promise, {
            loading: isOffer ? 'Sending Offer via Twilio...' : 'Sending Review Request...',
            success: () => {
                if (isOffer) {
                    sendOfferRequest(customerId);
                    return `Free delivery offer sent to ${customerName}!`;
                } else {
                    sendReviewRequest(customerId);
                    return `Review request sent to ${customerName}!`;
                }
            },
            error: 'Failed to send SMS.',
        });
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-bold text-slate-900">Customers Directory</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    <UserPlus size={18} className="mr-2" />
                    Add Customer
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">New Customer</h3>
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full border-slate-300 rounded-xl py-2 px-3 border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Service / Notes (Optional)</label>
                            <input
                                type="text"
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                                className="w-full border-slate-300 rounded-xl py-2 px-3 border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Haircut / Dinner"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                className="w-full border-slate-300 rounded-xl py-2 px-3 border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {customers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <History className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No customers yet</h3>
                    <p className="mt-1 text-sm text-slate-500 mb-6">
                        Add a customer to start sending review requests.
                    </p>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <UserPlus size={18} className="mr-2" />
                        Add First Customer
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search customers..."
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Context
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div className="ml-4 flex flex-col items-start gap-1">
                                                    <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                                        {customer.name}
                                                        {customer.visitCount > 1 && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-widest">
                                                                Return Client
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Added {new Date(customer.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-sm text-slate-500">
                                                    <Phone size={14} className="mr-2" />
                                                    {customer.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                                    <span>Visits: {customer.visitCount}</span>
                                                    {customer.service && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{customer.service}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'sent' ? 'bg-emerald-100 text-emerald-800' :
                                                    customer.status === 'offer_sent' ? 'bg-indigo-100 text-indigo-800' :
                                                        customer.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-slate-100 text-slate-800'
                                                }`}>
                                                {customer.status === 'sent' ? 'Review Sent' :
                                                    customer.status === 'offer_sent' ? 'Offer Sent' :
                                                        customer.status === 'replied' ? 'Replied' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {customer.visitCount > 1 && (
                                                    <button
                                                        onClick={() => handleSend(customer.id, customer.name, 'offer')}
                                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white transition-colors ${customer.status === 'offer_sent'
                                                                ? 'bg-slate-300 cursor-not-allowed shadow-none text-slate-50'
                                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                                            }`}
                                                        disabled={customer.status === 'offer_sent'}
                                                    >
                                                        Send Offer
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleSend(customer.id, customer.name, 'review')}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-xs font-medium transition-colors ${customer.status === 'sent' || customer.status === 'replied'
                                                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed shadow-none'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                                                        }`}
                                                    disabled={customer.status === 'sent' || customer.status === 'replied'}
                                                >
                                                    <Send size={14} className="mr-1.5" />
                                                    {customer.status === 'sent' ? 'Resend Review' : 'Send Review'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
