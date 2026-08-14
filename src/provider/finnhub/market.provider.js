import axios from "axios";

export const getQuote = async (symbol) => {
    const response = await axios.get(
        "https://finnhub.io/api/v1/quote",
        {
            params: {
                symbol,
                token: process.env.FINNHUB_KEY
            }
        }
    );
    console.log("Finnhub response:", response.data)
    return response.data
};

