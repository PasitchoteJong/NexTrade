import { mapAlphaVantageCandle } from "../mappers/candle.mapper.js";
import { getHistoricalCandle } from "../provider/alphavantage/candle.provider.js";

import {
    createCandles,
    getCandleBySymbol
} from "../services/candle.service.js";
import { symbolSchema } from "../validations/schema.js";


export async function importHistorical(req, res, next) {
    try {
        const { symbol } = symbolSchema.parseAsync(req.params);
        const data = await getHistoricalCandle(symbol);
        // console.log('Data:', data)

        const candles = mapAlphaVantageCandle(data, symbol);

        const result = await createCandles(candles);

        res.json({
            message: "Import candle success",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function getCandle(req, res, next) {
    try {
        const { symbol } = symbolSchema.parseAsync(req.params);
        const data = await getCandleBySymbol(symbol)
        console.log('Data:', data)
        res.json({
            message: "Get candle success",
            data: data
        });
    } catch (error) {
        next(error);
    }
}