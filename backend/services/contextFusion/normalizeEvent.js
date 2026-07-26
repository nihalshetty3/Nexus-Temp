export function normalizeEvent(event) {
    switch(event.source) {
        case "gmail":
            return {
                eventType: "email",
                source:"gmail",
                summary:event.email.subject,
                payload: event.email
            };

        case "sheets":
            return {
                eventType: "spreadSheet_update",
                source: "google_sheets",
                summary: `Cell update in ${event.sheet}`,
                payload: event
            };

        default:
            return {
                eventType: "unknown",
                source: event.source,
                summary:"Unknown event",
                payload: event
            };
    }
}