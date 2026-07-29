export function fusionService(
    normalizedEvent,
    plannerOutput,
    retrievedContext
) {

    const context = {
        budget: null,
        policy: null,
        quotations: [],
        relatedEmails: []
    };

    plannerOutput.requiredTools.forEach((task , index) => {
        const result = retrievedContext[index];

        switch (task.action) {
            case "retrieveBudget":
                context.budget = result;
                break;
            
            case "retrieveProcurementPolicy":
                context.policy = result;
                break;
            
            case "retrieveVendorQuotation":
                context.quotations = result;
                break;
            
            case "retrieveRelatedEmails": 
                context.relatedEmails = result;
                break;
        }
    });

    const summary = {
        budgetRemaining:
            context.budget?.remaining ?? null,

        budgetAvailable:
            context.budget
                ? context.budget.remaining > 0
                : false,
            quotationAvailable:
            context.quotations?.available ?? false,
        
        quotationCount:
            context.quotations?.quotationCount ?? 0,

        previousApprovals:
            context.relatedEmails?.approvals ?? 0,

        previousRejections:
            context.relatedEmails?.rejections ?? 0,

        similarPurchases:
            context.relatedEmails?.similarPurchases ?? 0
    };

    return {
        event: normalizedEvent,
        workflow: {
            name: plannerOutput.workflow,
            priority: plannerOutput.priority
        },
        context,
        summary
    };
}