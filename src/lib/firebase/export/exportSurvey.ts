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

    const flattenDoc = flattenDocument(snapshot.docs[0].data());
    const fields = Object.keys(flattenDoc);
    const idx = fields.indexOf("formId");
    if (idx != 0) {
        [fields[0], fields[idx]] = [fields[idx], fields[0]];
    }
    csv.push(fields.join(","));

    snapshot.docs.map((doc) => {
        const surveyDoc = doc.data();
        const surveyDocFlatten = flattenDocument(surveyDoc);
        const survey = fields.map(field => {
            return surveyDocFlatten[field];
        });
        
        csv.push(survey.join(","));
    });

    return csv.join(os.EOL);
}

function flattenDocument(obj: object, prefix = '') {
    let result: flattenDoc = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenDocument(value, newKey));
        } else {
            result[newKey] = Array.isArray(value) ? value.join(';') : value;
        }
    }

    return result;
}