export function fusionService(
    normalizedEvent,
    plannerOutput,
    retrievedContext
){
    return {
        event: normalizedEvent,
        workflow: {
            name: plannerOutput.workflow,
            priority: plannerOutput.priority
        },
        businessContext: retrievedContext
    };
}