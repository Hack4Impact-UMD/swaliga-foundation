import os from "os";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

type flattenDoc = {
    [key: string]: any
}

export async function survey2csv(surveyIds: string[]) {
    const csv = [];
    const surveyCollection = collection(db, "surveys");
    const q = query(surveyCollection, where("formId", "in", surveyIds));
    const snapshot = await getDocs(q);

    // Define CSV fields and fix its order
    const flattenDoc = flattenDocument(snapshot.docs[0].data(), []);
    const fields = Object.keys(flattenDoc);
    const idx = fields.indexOf("formId");
    if (idx != 0) {
        [fields[0], fields[idx]] = [fields[idx], fields[0]];
    }
    csv.push(fields.join(","));

    // Fix the order of fields of map in items field
    let itemsOrder: string[];
    const items = snapshot.docs[0].data().items;
    if (items.length > 0) {
        const flattenItem = flattenDocument(items[0], []);
        itemsOrder = Object.keys(flattenItem);
    }

    // For each document, create each row
    snapshot.docs.map((doc) => {
        const surveyDoc = doc.data();
        const surveyDocFlatten = flattenDocument(surveyDoc, itemsOrder);
        const survey = fields.map(field => {
            return surveyDocFlatten[field];
        });
        csv.push(survey.join(","));
    });

    return csv.join(os.EOL);
}

function flattenDocument(obj: object, order: string[], prefix = '') {
    let result: flattenDoc = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) { 
            Object.assign(result, flattenDocument(value, order, newKey));
        } else if (Array.isArray(value)) {
            result[newKey] = value.map((item) => {
                if (typeof item === 'object') {
                    const flatten = flattenDocument(item, order, '');
                    const orderRevised: flattenDoc = {};
                    order.forEach((field) => {
                        if (field in flatten) {
                            orderRevised[field] = flatten[field];
                        }
                    });
                    return JSON.stringify(orderRevised).replace(",", "; ");
                } else {
                    return item.toString();
                }
            }).join(' | ');
        } else {
            result[newKey] = value;
        }
    }

    return result;
}