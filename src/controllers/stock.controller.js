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
  addFavStockService,
  checkFavStock,
  createStockBySymbol,
  getStockBy,
  getStockByForSwith,
  getstocks,
  importStock,
  patchStockById,
  removeFavStockService,
  updateStockStatusById
} from "../services/stock.service.js";
import { symbol } from "zod";
import { getStockProfile } from "../provider/finnhub/stock.provider.js";
import { mapFinnhubStock } from "../mappers/stock.mapper.js";


export async function stockCreate(req, res, next) {
  try {
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
    });
  } catch (error) {
    next(error);
  }

}

export async function searchStocks(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

export async function getStockBySymbol(req, res, next) {
  try {
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
    });
  } catch (error) {
    next(error);
  }
}

export async function patchStock(req, res, next) {
  try {
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
    });
  } catch (error) {
    next(error);
  }
}

export async function softDeleteStock(req, res, next) {
  try {
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
    });
  } catch (error) {
    next(error);
  }
}

export async function importFinnhub(req, res, next) {
  try {
    const symbols = [
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
    const results = [];

    for (const symbol of symbols) {

      try {
        const data = await getStockProfile(symbol);

        if (!data || !data.ticker) {
          console.log(`Skip ${symbol}: No data`);
          continue;
        }

        const stockData = mapFinnhubStock(data);
        const result = await importStock(stockData)

        results.push(result);
      } catch (error) {
        console.log(`Import failed: ${symbol}`, error.message);
      }
    }

    res.json({
      message: "Import success",
      data: results
    });
  } catch (error) {
    next(error);
  }
}

export async function addFavStock(req, res, next) {
  try {
    const { id: userId } = req.user
    const { stockId } = req.params;
    // console.log("StockId: ", stockId)
    // console.log("userId: ", userId) // id
    // console.log("user", user) //undefind

    const haveStock = await getStockBy("id", stockId)
    // console.log("havestock at addFav:", haveStock)
    if (!haveStock) {
      return next(createHttpError(400, 'Stock not found'))
    }

    const haveFav = await checkFavStock(userId, stockId)
    // console.log("haveFav at add Fav:", haveFav)
    if (haveFav) {
      return res.status(200).json({
        message: "Stock is already in favorites",
        data: haveFav
      })
    }
    const result = await addFavStockService(userId, stockId)
    return res.status(201).json({
      message: "Stock added to favorites",
      data: result
    })
  } catch (error) {
    next(errror);
  }


}

export async function delFavStock(req, res, next) {
  try {
    const { id: userId } = req.user
    const { stockId } = req.params;
    // console.log("userId:",userId)
    // console.log("stockId:",stockId)

    const haveStock = await getStockBy("id", stockId)
    if (!haveStock) {
      return next(createHttpError(400, 'Stock not found'))
    }

    const haveFav = await checkFavStock(userId, stockId)
    if (!haveFav) {
      return res.status(200).json({
        message: "Stock is not in favorites",
        data: haveFav
      })
    }
    console.log("habefav:", haveFav);

    const result = await removeFavStockService(userId, stockId)
    return res.status(201).json({
      message: "Stock removed to favorites",
      data: result
    })
  } catch (error) {
    next(error);
  }


}

export async function getFavStock(req, res, next) {
  try {
    const { id: userId } = req.user
    const { stockId } = req.params;

    const haveStock = await getStockBy("id", stockId)
    if (!haveStock) {
      return next(createHttpError(400, 'Stock not found'))
    }
    const result = await checkFavStock(userId, stockId)
    return res.status(201).json({
      message: "Get haveFavorite Stock Success",
      data: result
    })
  } catch (error) {
    next(error)
  }
}