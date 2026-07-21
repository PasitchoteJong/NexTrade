export const mapFinnhubStock= (data)=>{
    return{
        symbol:data.ticker,
        companyName: data.name,
        exchange: data.exchange,
        currency : data.currency,
        logo:data.logo ?? null,
        industry:data.finnhubIndustry ?? null

    }
}