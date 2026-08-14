import axios from "axios";

export const getHistoricalCandle = async (symbol) => {
    const response = await axios.get(
        "https://www.alphavantage.co/query",
        {
            params: {
                function: "TIME_SERIES_DAILY",
                symbol,
                outputsize: "compact",
                apikey: process.env.ALPHA_VANTAGE_KEY
            }
        }
    )
    //console.log("Alpha response:", JSON.stringify(response.data, null, 2));
    //console.log("API Key:",process.env.ALPHA_VANTAGE_KEY )


    return response.data;
}