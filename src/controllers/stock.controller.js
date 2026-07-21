import createHttpError from "http-errors"
import { getMe } from "./auth.controller.js"
import {
  stockIdSchema,
  stockSchema,
  stockSearchSchema,
  stockUpdateSchema,
  updateStockStatusSchema
} from "../validations/schema.js";
import {
  createStockBySymbol,
  getStockBy,
  getStockByForSwith,
  getstocks,
  importStock,
  patchStockById,
  updateStockStatusById
} from "../services/stock.service.js";
import { symbol } from "zod";
import { getStockProfile } from "../provider/stock.provider.js";
import { mapFinnhubStock } from "../mappers/stock.mapper.js";


export async function stockCreate(req, res, next) {
  // console.log('stockCreate successful')

  //check role in future
  const user = req.user;
  // console.log('stock_controller',user)

  // const { symbol, companyName, exchange, sector, industry } = stockSchema.parse(req.body);
  const data = await stockSchema.parseAsync(req.body);

  const haveStock = await getStockBy('symbol', data.symbol)
  if (haveStock) {
    return next(createHttpError(400, 'This stock already exists.'))
  }

  const result = await createStockBySymbol(data)
  res.json({
    message: 'Create successful',
    result: result
  })

}

export async function searchStocks(req, res, next) {
  //const user = req.user;
  //console.log('this user from controller:', user)


  let { search } = await stockSearchSchema.parseAsync(req.query);


  if (search) {
    search = search.trim().toUpperCase();
  }
  // console.log("search:", search);
  // console.log("type:", typeof search);

  const stocks = await getstocks(search);
  // console.log('this stocks from controller:', stocks)

  res.json({
    data: stocks
  })

  // res.json({
  //   data: stocks.map(stock => ({
  //     symbol: stock.symbol,
  //     companyName: stock.companyName
  //   }))
  // });
}

export async function getStockBySymbol(req, res, next) {
  // console.log('hey')
  const { symbol } = req.params;
  //console.log('symbol:', symbol)

  const stock = await getStockBy('symbol', symbol)
  if (!stock) {
    return next(createHttpError(404, "Stock not found"));
  }
  //console.log('this stocks from controller:', stocks)

  res.json({
    data: stock
  })
}

export async function patchStock(req, res, next) {
  // console.log('patch stock')
  const { id } = await stockIdSchema.parseAsync(req.params);
  // console.log(id)

  const stock = await getStockBy('id', id)
  // console.log(stock)

  if (!stock) {
    next(createHttpError[404]('Stock id not found'))
  }

  const data = await stockUpdateSchema.parseAsync(req.body);
  const result = await patchStockById(stock.id, data)

  res.json({
    message: "Update successful",
    data: result
  })
}

export async function softDeleteStock(req, res, next) {
  const { id } = await stockIdSchema.parseAsync(req.params);
  console.log(id)

  const stock = await getStockByForSwith('id', id)
  // console.log(stock)

  if (!stock) {
    next(createHttpError[404]('Stock id not found'))
  }

  const { isActive } = await updateStockStatusSchema.parseAsync(req.body);
  // console.log(typeof (isActive))
  
  const message = isActive
    ? "Stock activated successful"
    : "Stock deactivated successful";

  const result = await updateStockStatusById(stock.id, isActive)


  res.json({
    message: message,
    data: result
  })
}

export async function importFinnhub(req, res, next) {
  const symbols =[
    "AAPL",
    "MSFT",
    "NVDA",
    "TSLA",
    "AMZN",
    "GOOGL",
    "META",
    "NFLX",
    "AMD",
    "V"

  ];
  const results=[];

    for(const symbol of symbols){

      try{
        const data = await getStockProfile(symbol);

        if(!data || !data.ticker){
          console.log(`Skip ${symbol}: No data`);
          continue;
        }
        
        const stockData = mapFinnhubStock(data);
        const result = await importStock(stockData)
  
        results.push(result);
      }catch(error){
        console.log(`Import failed: ${symbol}`,error.message);
      }
    }

  res.json({
    message:"Import success",
    data: results
  });
}

