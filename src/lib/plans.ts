export type PlanType = 'FREE' | 'BASIC' | 'PRO';

export interface PlanConfig {
    plan: PlanType;
    price: number;
    billing_limit: number | 'UNLIMITED';
    stock_enabled: boolean;
    pending_tracking: boolean;
    whatsapp_customer_bill: boolean; // Send bill to customer via WA
    whatsapp_daily_summary: boolean; // Daily summary to owner
    reports_enabled: boolean;
    advanced_reports: boolean;
    export_enabled: boolean;
    priority_support: boolean;
    language_support: string[];
}

export const PLANS: Record<PlanType, PlanConfig> = {
    FREE: {
        plan: 'FREE',
        price: 0,
        billing_limit: 20,
        stock_enabled: false,
        pending_tracking: true,
        whatsapp_customer_bill: false,
        whatsapp_daily_summary: false,
        reports_enabled: false,
        advanced_reports: false,
        export_enabled: false,
        priority_support: false,
        language_support: ['EN']
    },
    BASIC: {
        plan: 'BASIC',
        price: 299,
        billing_limit: 'UNLIMITED',
        stock_enabled: true,
        pending_tracking: true,
        whatsapp_customer_bill: true,
        whatsapp_daily_summary: true,
        reports_enabled: true,
        advanced_reports: false,
        export_enabled: true,
        priority_support: false, // Basic support
        language_support: ['EN', 'TA', 'HI']
    },
    PRO: {
        plan: 'PRO',
        price: 499,
        billing_limit: 'UNLIMITED',
        stock_enabled: true,
        pending_tracking: true,
        whatsapp_customer_bill: true,
        whatsapp_daily_summary: true,
        reports_enabled: true,
        advanced_reports: true,
        export_enabled: true,
        priority_support: true,
        language_support: ['EN', 'TA', 'HI']
    }
};

export const getPlanConfig = (planName: string): PlanConfig => {
    // Default to FREE if unknown
    const key = (planName || 'FREE').toUpperCase() as PlanType;
    return PLANS[key] || PLANS.FREE;
};
