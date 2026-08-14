export const mapQuote = (symbol,data)=>{
    return{
        symbol,
        currentPrice:data.c,
        change:data.d,
        changePercent:data.dp,
        high:data.h,
        low:data.l,
        open:data.o,
        previousClose:data.pc,
        timestamp:data.t,

    }
}