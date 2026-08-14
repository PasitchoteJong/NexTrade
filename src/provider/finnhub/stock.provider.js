import axios from "axios";

export const getStockProfile = async (symbol) => {
    const response = await axios.get(
        "https://finnhub.io/api/v1/stock/profile2",
        {
            params:{
                symbol,
                token:process.env.FINNHUB_KEY
            }
        }
    );
    return response.data;
}