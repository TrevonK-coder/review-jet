import { Check, Zap, Store } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'sonner';

const Billing = () => {
    const subscriptionTier = useStore(state => state.subscriptionTier);
    const setSubscriptionTier = useStore(state => state.setSubscriptionTier);

    const handlePlanChange = (tier: 'standard' | 'pro') => {
        setSubscriptionTier(tier);
        toast.success(`Successfully ${tier === 'pro' ? 'upgraded to Pro' : 'downgraded to Standard'} plan!`);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="text-center py-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Simple, transparent pricing</h1>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
                    No hidden fees, no limits on reviews. Pay only for the SMS messages you send at our standard Twilio rates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Standard Plan */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-8">
                        <div className="flex items-center space-x-3 text-emerald-500 mb-6">
                            <Store size={28} />
                            <h3 className="text-xl font-bold text-slate-900">Standard Plan</h3>
                        </div>

                        <div className="mb-6 flex items-baseline">
                            <span className="text-5xl font-extrabold text-slate-900">$29</span>
                            <span className="text-slate-500 ml-2">/month</span>
                        </div>

                        <p className="text-sm text-slate-500 mb-6">Perfect for single locations getting started with automation.</p>

                        <ul className="space-y-4 mb-8">
                            {['Unlimited Customers', 'Automated SMS Triggers', 'Conversion Analytics', 'Connect your own Twilio'].map((feature, i) => (
                                <li key={i} className="flex items-center text-sm">
                                    <Check size={18} className="text-emerald-500 mr-3 shrink-0" />
                                    <span className="text-slate-600 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handlePlanChange('standard')}
                            disabled={subscriptionTier === 'standard'}
                            className={`w-full py-3.5 rounded-xl font-bold transition-colors ${subscriptionTier === 'standard'
                                    ? 'text-indigo-600 bg-indigo-50 cursor-not-allowed'
                                    : 'text-white bg-slate-900 hover:bg-slate-800'
                                }`}
                        >
                            {subscriptionTier === 'standard' ? 'Current Plan' : 'Downgrade to Standard'}
                        </button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-500/20 border border-slate-800 overflow-hidden relative transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase">
                        Most Popular
                    </div>
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl mix-blend-screen pointer-events-none"></div>

                    <div className="p-8 relative">
                        <div className="flex items-center space-x-3 text-indigo-400 mb-6">
                            <Zap size={28} />
                            <h3 className="text-xl font-bold text-white">Pro Plan</h3>
                        </div>

                        <div className="mb-6 flex items-baseline">
                            <span className="text-5xl font-extrabold text-white">$79</span>
                            <span className="text-slate-400 ml-2">/month</span>
                        </div>

                        <p className="text-sm text-slate-400 mb-6">For growing businesses needing advanced return-client logic.</p>

                        <ul className="space-y-4 mb-8 text-sm">
                            <li className="flex items-center">
                                <Check size={18} className="text-indigo-400 mr-3 shrink-0" />
                                <span className="text-slate-300 font-medium">Everything in Standard, plus:</span>
                            </li>
                            {['Returning Client Identification', 'Custom Offer SMS Triggers', 'AI Personal Assistant (ReviewJet Sparkle)', 'Priority Support'].map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <Check size={18} className="text-emerald-400 mr-3 shrink-0" />
                                    <span className="text-white font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handlePlanChange('pro')}
                            disabled={subscriptionTier === 'pro'}
                            className={`w-full py-3.5 rounded-xl font-bold transition-colors shadow-lg ${subscriptionTier === 'pro'
                                    ? 'text-indigo-200 bg-indigo-900/50 cursor-not-allowed shadow-none'
                                    : 'text-white bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/30'
                                }`}
                        >
                            {subscriptionTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                        </button>
                    </div>
                </div>

            </div>

            <div className="mt-16 bg-white rounded-3xl p-8 max-w-4xl mx-auto shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Why bring your own Twilio?</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Many review platforms charge massive markups per text message. By connecting your own Twilio account, you pay the original wholesale rate (often less than $0.01 per SMS) directly to Twilio. No hidden usage fees from us—ever.
                    </p>
                </div>
                <div className="w-full md:w-auto flex flex-col gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between min-w-[200px]">
                        <span className="text-sm font-medium text-slate-600">ReviewJet Markup</span>
                        <span className="font-bold text-emerald-600 text-lg">$0.00</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between min-w-[200px]">
                        <span className="text-sm font-medium text-slate-600">Twilio Cost / SMS</span>
                        <span className="font-bold text-slate-900 text-lg">~$0.0079</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
