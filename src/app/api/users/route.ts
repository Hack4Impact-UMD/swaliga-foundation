import { getAccountById, createAccount, updateAccount } from "@/lib/firebase/database/users";
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "@/types/User";
import { UpdateData } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const userid = req.query.userid;
            if (!userid) {
                res.status(400).json({ error: 'missing userid' });
            } else {
                let strUserId = String(userid);
                try {
                    const result = await getAccountById(strUserId);
                    res.status(200).json({ result });
                } catch {
                    res.status(404).json({ error: 'error with getting the account via the given id' });
                }
            }
        } catch (err) {
            res.status(500).json({ error: 'failed to load data' });
        }
    } else if (req.method === 'POST') {
        try {
            if (!req.body) {
                return res.status(400).json({ error: 'missing request body' });
            }

            const user : User = req.body;
            
            if (checkIfValidUser(user)) {
                try {
                    const result = await createAccount(user);
                    return res.status(200).json({ result });
                } catch {
                    return res.status(404).json({ error: 'error with creating the account' });
                }
            } else {
                return res.status(400).json({ error: 'invalid user data' });
            }
        } catch (err) {
            res.status(500).json({ error: 'failed to load data' });
        }
    } 
}

function checkIfValidUser(user : User) {
    return (user && user.isAdmin && user.firstName && user.lastName && user.address && user.school 
    && user.birthdate && user.email && user.phone && user.password && user.swaligaId && user.id);
}
