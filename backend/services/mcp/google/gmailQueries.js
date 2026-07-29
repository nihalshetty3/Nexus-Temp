
export const GmailQueries = {

    PURCHASE_REQUESTS:
        '(purchase OR procurement OR invoice OR quotation) newer_than:30d',

    APPROVAL_EMAILS:
        '(approval OR approve OR pending) newer_than:30d',

    BUDGET_DISCUSSIONS:
        'budget newer_than:30d',

    VENDOR_QUOTES:
        '(quotation OR quote OR invoice) newer_than:30d',

    HR_EMAILS:
        '(leave OR employee OR onboarding) newer_than:30d'

};