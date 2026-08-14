export const mapAlphaVantageCandle = (data, symbol) => {

    const timeSeries =
        data["Time Series (Daily)"];

    if (!timeSeries){
        throw new Error("Historical candle data not found");
    }

        return Object.entries(timeSeries)
            .map(([date, value]) => ({

                symbol,
                timestamp: new Date(date),
                open: Number(value["1. open"]),
                high: Number(value["2. high"]),
                low: Number(value["3. low"]),
                close: Number(value["4. close"]),
                volume: Number(value["5. volume"])
            }));

};