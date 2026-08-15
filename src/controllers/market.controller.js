import { getQuote } from "../provider/finnhub/market.provider.js"
import { mapQuote } from "../mappers/market.mapper.js"


export async function quote(req, res, next) {
    try {
        // console.log('Check Quote')
        const { symbol } = req.params;
        // console.log(symbol);

        const data = await getQuote(symbol);
        const result = mapQuote(symbol, data);


        res.json({
            message: "Get data success",
            data: result

        });
    } catch (error) {
        next(error);
    }
}
