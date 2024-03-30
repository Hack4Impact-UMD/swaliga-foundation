import { Watch } from "@/types/watch-types";
import { forms } from "@/lib/googleAuthorization";

export async function createWatch(formId: string, eventType: string) {
    try {
        const response = await forms.forms.watches.create(
            {
                "formId": formId,
                "requestBody": {
                    "watch": {
                        "eventType": eventType,
                        "target": {
                            "topic": {
                                "topicName": "projects/swaliga-foundation/topics/forms"
                            }
                        }
                    }
                }
            }
        );
        
        console.log("Response", response);
    } catch (error) {
        console.log("Error with creating watch using given information", error);
        throw error;
    }
}

export async function renewWatch(formId : string, watchId : string) {
    try {
        const response = await forms.forms.watches.renew({"formId": formId, "watchId": watchId});
        console.log("Response", response);
    } catch (error) {
        console.log("Error with renewing watch using given formId and watchId", error);
        throw error;
    }
}