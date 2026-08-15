import { getTransactionService } from "../services/transaction.service.js";


export async function getTransaction(req, res, next) {
    try {
        const userId = req.user.id;

        const result = await getTransactionService(userId);

        res.json({
            message: "Transaction history",
            data: result
        });
    } catch (error) {
        next(error);
    }

}