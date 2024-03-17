import { getAccountById, createAccount, updateAccount } from "@/lib/firebase/database/users";
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "@/types/User";
import { UpdateData } from "firebase/firestore";

//TODO: adjust code to use [userId]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') { // get user by id
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
    } else if (req.method === 'PUT') { // update user by id
        try {
            if (!req.body) {
                return res.status(400).json({ error: 'missing request body' });
            }

            const userid = req.query.userid;
            let info : UpdateData<User> = req.body;

            if (!userid) {
                return res.status(400).json({ error: 'missing userid' });
            } else if (!info) {
                return res.status(400).json({ error: 'invalid user data' });
            } else {
                try {
                    let strUserId = String(userid);
                    const result = await updateAccount(strUserId, info);
                    res.status(200).json({ result });
                } catch {
                    res.status(404).json({ error: 'error with updating the account' });
                }
            }
        } catch (err) {
            res.status(500).json({ error: 'failed to load data' });
        }
    }
}