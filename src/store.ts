import { create } from 'zustand';

export type Customer = {
    id: string;
    name: string;
    phone: string;
    service?: string;
    visitCount: number;
    status: 'pending' | 'sent' | 'replied' | 'offer_sent' | 'follow_up_sent';
    createdAt: string;
    requestSentAt?: string;
};

export type AppState = {
    isAuthenticated: boolean;
    businessName: string;
    subscriptionTier: 'standard' | 'pro';
    placeId: string;
    twilioConfig: {
        accountSid: string;
        authToken: string;
        messagingServiceSid: string;
    };
    aiApiKey: string;
    customers: Customer[];
    metrics: {
        reviewsSent: number;
        reviewClicks: number;
        offersSent: number;
        offerClicks: number;
    };
    offerTemplate: string;
    login: () => void;
    logout: () => void;
    setBusinessName: (name: string) => void;
    setSubscriptionTier: (tier: 'standard' | 'pro') => void;
    setPlaceId: (id: string) => void;
    setTwilioConfig: (config: AppState['twilioConfig']) => void;
    setAiApiKey: (key: string) => void;
    setOfferTemplate: (template: string) => void;
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'status' | 'visitCount'>) => void;
    sendReviewRequest: (customerId: string) => void;
    sendOfferRequest: (customerId: string) => void;
    sendFollowUpRequest: (customerId: string) => void;
    loadDemoData: (type: 'barbershop' | 'restaurant') => void;
};

// --- Mock Data Generators ---
const generatePastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
};

const barbershopDemo = {
    businessName: "Frankie's Fade Room",
    customers: [
        { id: 'bb1', name: 'Marcus L.', phone: '+1 (555) 019-2033', service: 'Skin Fade + Beard Trim', visitCount: 4, status: 'sent', createdAt: generatePastDate(5), requestSentAt: generatePastDate(4) },
        { id: 'bb2', name: 'James W.', phone: '+1 (555) 928-1122', service: 'Classic Scissor Cut', visitCount: 1, status: 'replied', createdAt: generatePastDate(2), requestSentAt: generatePastDate(2) },
        { id: 'bb3', name: 'David C.', phone: '+1 (555) 882-3944', service: 'Kids Cut', visitCount: 8, status: 'pending', createdAt: generatePastDate(0) },
        { id: 'bb4', name: 'Tony S.', phone: '+1 (555) 110-9922', service: 'Hot Towel Shave', visitCount: 2, status: 'offer_sent', createdAt: generatePastDate(3), requestSentAt: generatePastDate(1) },
        { id: 'bb5', name: 'Elias R.', phone: '+1 (555) 443-2211', service: 'Line Up', visitCount: 1, status: 'pending', createdAt: generatePastDate(0) },
    ] as Customer[],
    metrics: { reviewsSent: 110, reviewClicks: 65, offersSent: 32, offerClicks: 19 }
};

const restaurantDemo = {
    businessName: "La Trattoria Roma",
    customers: [
        { id: 'rs1', name: 'Sarah M.', phone: '+1 (555) 332-9482', service: 'Dinner for 2 (Anniversary)', visitCount: 2, status: 'sent', createdAt: generatePastDate(6), requestSentAt: generatePastDate(5) },
        { id: 'rs2', name: 'John & Co.', phone: '+1 (555) 993-2211', service: 'Party of 6 (Birthday)', visitCount: 5, status: 'replied', createdAt: generatePastDate(2), requestSentAt: generatePastDate(2) },
        { id: 'rs3', name: 'Emily H.', phone: '+1 (555) 441-2993', service: 'Lunch Special', visitCount: 12, status: 'pending', createdAt: generatePastDate(0) },
        { id: 'rs4', name: 'Michael T.', phone: '+1 (555) 884-3322', service: 'Takeout Order', visitCount: 1, status: 'follow_up_sent', createdAt: generatePastDate(10), requestSentAt: generatePastDate(1) },
        { id: 'rs5', name: 'The Smiths', phone: '+1 (555) 554-1199', service: 'Sunday Brunch', visitCount: 3, status: 'offer_sent', createdAt: generatePastDate(4), requestSentAt: generatePastDate(1) },
    ] as Customer[],
    metrics: { reviewsSent: 280, reviewClicks: 160, offersSent: 70, offerClicks: 50 }
};

export const useStore = create<AppState>((set) => ({
    isAuthenticated: false,
    businessName: '',
    subscriptionTier: 'standard',
    placeId: '',
    twilioConfig: {
        accountSid: '',
        authToken: '',
        messagingServiceSid: '',
    },
    aiApiKey: '',
    customers: [],
    metrics: {
        reviewsSent: 0,
        reviewClicks: 0,
        offersSent: 0,
        offerClicks: 0,
    },
    offerTemplate: "Hi [Customer Name]! Thanks for being a loyal customer at [Business Name]. Here is a special offer: Free delivery within 10km for a whole month! Reply YES to claim.",
    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
    setBusinessName: (name) => set({ businessName: name }),
    setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
    setPlaceId: (id) => set({ placeId: id }),
    setTwilioConfig: (config) => set({ twilioConfig: config }),
    setAiApiKey: (key) => set({ aiApiKey: key }),
    setOfferTemplate: (template) => set({ offerTemplate: template }),
    addCustomer: (customer) =>
        set((state) => {
            const existingClientIndex = state.customers.findIndex(c => c.phone === customer.phone);

            if (existingClientIndex >= 0) {
                // Update existing client
                const updatedCustomers = [...state.customers];
                const existing = updatedCustomers[existingClientIndex];
                updatedCustomers[existingClientIndex] = {
                    ...existing,
                    name: customer.name,
                    service: customer.service || existing.service,
                    visitCount: existing.visitCount + 1,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };

                // Move them to the top of the list
                const clientToMove = updatedCustomers.splice(existingClientIndex, 1)[0];
                return { customers: [clientToMove, ...updatedCustomers] };
            } else {
                // Add new client
                return {
                    customers: [
                        {
                            ...customer,
                            id: Math.random().toString(36).substring(7),
                            visitCount: 1,
                            status: 'pending',
                            createdAt: new Date().toISOString(),
                        },
                        ...state.customers,
                    ],
                };
            }
        }),
    sendReviewRequest: (customerId) =>
        set((state) => ({
            customers: state.customers.map((c) =>
                c.id === customerId ? { ...c, status: 'sent', requestSentAt: new Date().toISOString() } : c
            ),
            metrics: {
                ...state.metrics,
                reviewsSent: state.metrics.reviewsSent + 1,
            },
        })),
    sendOfferRequest: (customerId) =>
        set((state) => ({
            customers: state.customers.map((c) =>
                c.id === customerId ? { ...c, status: 'offer_sent', requestSentAt: new Date().toISOString() } : c
            ),
            metrics: {
                ...state.metrics,
                offersSent: state.metrics.offersSent + 1,
            },
        })),
    sendFollowUpRequest: (customerId) =>
        set((state) => ({
            customers: state.customers.map((c) =>
                c.id === customerId ? { ...c, status: 'follow_up_sent', requestSentAt: new Date().toISOString() } : c
            ),
            metrics: {
                ...state.metrics,
                reviewsSent: state.metrics.reviewsSent + 1,
            },
        })),
    loadDemoData: (type) =>
        set(() => {
            const data = type === 'barbershop' ? barbershopDemo : restaurantDemo;
            return {
                businessName: data.businessName,
                placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Fixed demo Place ID
                customers: data.customers,
                metrics: data.metrics,
            };
        })
}));
