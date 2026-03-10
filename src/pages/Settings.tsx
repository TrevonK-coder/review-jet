import React, { useState } from 'react';
import { useStore } from '../store';
import { Save, Link as LinkIcon, Smartphone, Building } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const {
        businessName,
        placeId,
        twilioConfig,
        offerTemplate,
        setBusinessName,
        setPlaceId,
        setTwilioConfig,
        setOfferTemplate
    } = useStore();

    const [formBusiness, setFormBusiness] = useState(businessName);
    const [formPlaceId, setFormPlaceId] = useState(placeId);
    const [formTwilio, setFormTwilio] = useState(twilioConfig);
    const [formOffer, setFormOffer] = useState(offerTemplate);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setBusinessName(formBusiness);
        setPlaceId(formPlaceId);
        setTwilioConfig(formTwilio);
        setOfferTemplate(formOffer);
        toast.success('Settings saved successfully!');
    };

    const reviewLink = formPlaceId
        ? `https://search.google.com/local/writereview?placeid=${formPlaceId}`
        : '';

    const reviewPreview = `Hi [Customer Name], thanks for choosing ${formBusiness || '[Business Name]'}! We'd love to hear your feedback. It takes 30 seconds to leave us a review here: ${reviewLink || '[Link]'}`;

    // Simple template replacement for preview
    const offerPreview = formOffer
        .replace(/\[Customer Name\]/g, 'John Doe')
        .replace(/\[Business Name\]/g, formBusiness || 'Your Business');

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Demo Loader */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-indigo-900 mb-2">Load Demo Data</h2>
                    <p className="text-sm text-indigo-700 mb-4">
                        Instantly populate the app with authentic-looking data to see how ReviewJet fits different industries.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                useStore.getState().loadDemoData('barbershop');
                                setFormBusiness("Frankie's Fade Room");
                                setFormPlaceId("ChIJN1t_tDeuEmsRUsoyG83frY4");
                                toast.success('Loaded Barbershop demo data!');
                            }}
                            className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                        >
                            💈 Load Barbershop Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                useStore.getState().loadDemoData('restaurant');
                                setFormBusiness("La Trattoria Roma");
                                setFormPlaceId("ChIJN1t_tDeuEmsRUsoyG83frY4");
                                toast.success('Loaded Restaurant demo data!');
                            }}
                            className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                        >
                            🍝 Load Restaurant Profile
                        </button>
                    </div>
                </div>

                {/* Core Config */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50">
                        <Building size={20} className="text-indigo-600 mr-3" />
                        <h2 className="text-lg font-medium text-slate-900">General Information</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                            <input
                                type="text"
                                value={formBusiness}
                                onChange={(e) => setFormBusiness(e.target.value)}
                                className="w-full border-slate-300 rounded-xl py-2.5 px-3 border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Central Perk Coffee"
                            />
                            <p className="mt-1 text-xs text-slate-500">This will appear in your SMS messages.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Google Business Place ID</label>
                            <input
                                type="text"
                                value={formPlaceId}
                                onChange={(e) => setFormPlaceId(e.target.value)}
                                className="w-full border-slate-300 rounded-xl py-2.5 px-3 border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                You can find your Place ID using the Google Maps Platform Place ID Finder.
                            </p>
                        </div>

                        {formPlaceId && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center space-x-2 text-sm text-slate-700 mb-2">
                                    <LinkIcon size={16} className="text-indigo-500" />
                                    <span className="font-semibold">Generated Review Link:</span>
                                </div>
                                <a href={reviewLink} target="_blank" rel="noreferrer" className="text-indigo-600 break-all text-sm hover:underline">
                                    {reviewLink}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Twilio Integartion */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50">
                        <Smartphone size={20} className="text-emerald-600 mr-3" />
                        <h2 className="text-lg font-medium text-slate-900">Twilio Integration</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-slate-600">
                            Configure your Twilio credentials to enable automated SMS dispatching. For this demo, these values are just placeholders.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Account SID</label>
                                <input
                                    type="text"
                                    value={formTwilio.accountSid}
                                    onChange={(e) => setFormTwilio({ ...formTwilio, accountSid: e.target.value })}
                                    className="w-full border-slate-300 rounded-xl py-2.5 px-3 border outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Auth Token</label>
                                <input
                                    type="password"
                                    value={formTwilio.authToken}
                                    onChange={(e) => setFormTwilio({ ...formTwilio, authToken: e.target.value })}
                                    className="w-full border-slate-300 rounded-xl py-2.5 px-3 border outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="••••••••••••••••••••••••••••••••"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Messaging Service SID</label>
                                <input
                                    type="text"
                                    value={formTwilio.messagingServiceSid}
                                    onChange={(e) => setFormTwilio({ ...formTwilio, messagingServiceSid: e.target.value })}
                                    className="w-full border-slate-300 rounded-xl py-2.5 px-3 border outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMS Template Builder */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50">
                        <Smartphone size={20} className="text-indigo-600 mr-3" />
                        <h2 className="text-lg font-medium text-slate-900">Offer Template Builder</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-slate-600">
                            Customize the SMS template sent to returning clients. You can use <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">[Customer Name]</span> and <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">[Business Name]</span> as variables.
                        </p>
                        <div>
                            <textarea
                                value={formOffer}
                                onChange={(e) => setFormOffer(e.target.value)}
                                rows={4}
                                className="w-full border-slate-300 rounded-xl py-3 px-4 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="Your custom offer message here..."
                            />
                        </div>
                    </div>
                </div>

                {/* SMS Previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-800">
                            <h2 className="text-base font-medium text-white">Review Request Preview</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-end">
                            <div className="bg-white rounded-2xl p-4 w-full rounded-bl-none shadow relative">
                                <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">{reviewPreview}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-950 rounded-2xl shadow-sm border border-indigo-900 overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-indigo-900">
                            <h2 className="text-base font-medium text-white">Offer SMS Preview</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-end">
                            <div className="bg-indigo-50 rounded-2xl p-4 w-full rounded-bl-none shadow relative">
                                <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">{offerPreview}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                    <button
                        type="submit"
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                    >
                        <Save size={20} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
