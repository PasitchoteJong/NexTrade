import {
  buyStockService,
  getPortfolioService,
  sellStockService
} from "../services/trade.service.js";
import createHttpError from "http-errors";
import { tradeSchema } from "../validations/schema.js";
import { getQuote } from "../provider/finnhub/market.provider.js"
import { mapQuote } from "../mappers/market.mapper.js";
import { getStockBy } from "../services/stock.service.js";

export async function buyStock(req, res, next) {
  try {
    const { symbol, quantity } = await tradeSchema.parseAsync(req.body);
    const userId = req.user.id;

    //find stock
    const stock = await getStockBy('symbol', symbol)
    if (!stock) {
      return next(createHttpError(400, 'This stock not have data'))
    }

    // Get present pricestock 
    const rawQuote = await getQuote(symbol);
    const quote = mapQuote(symbol, rawQuote);

    const currentPrice = quote.currentPrice;


    // transaction 
    const result = await buyStockService(userId, stock.id, quantity, currentPrice)

    res.json({
      message: "Buy stock successed",
      data: result

    });
  } catch (error) {
    next(error);
  }

}

export async function sellStock(req, res, next) {
  try {
    const { symbol, quantity } = await tradeSchema.parseAsync(req.body);
    const userId = req.user.id;

    //find stock
    const stock = await getStockBy('symbol', symbol)
    if (!stock) {
      return next(createHttpError(400, 'This stock not have data'))
    }

    // Get present pricestock
    const rawQuote = await getQuote(symbol);
    const quote = mapQuote(symbol, rawQuote);

    const currentPrice = quote.currentPrice;

    const result = await sellStockService(userId, stock.id, quantity, currentPrice)

    res.json({
      message: "Sell stock successed",
      data: result
    })
  } catch (error) {
    next(error);
  }
}

export async function getPortfolio(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await getPortfolioService(userId);

    res.json({
      message: "Portfolio",
      data: result
    });
  }catch(error){
    next(error);
  }
}