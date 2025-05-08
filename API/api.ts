export const categories = [
  {
    code: "",
    pic: "https://img.icons8.com/fluent/96/000000/bitcoin.png",
    name: "all",
  },
  {
    code: "",
    pic: "https://img.icons8.com/fluent/96/000000/ethereum.png",
    name: "trading",
  },
  {
    code: "",
    pic: "https://img.icons8.com/fluent/96/000000/blockchain-technology.png",
    name: "technology",
  },
  {
    pic: "https://img.icons8.com/fluent/96/000000/exchange.png",
    name: "exchange",
  },
  {
    pic: "https://img.icons8.com/fluent/96/000000/regulation.png",
    name: "regulation",
  },
  {
    pic: "https://img.icons8.com/fluent/96/000000/nft.png",
    name: "nft",
  },
];

export const sources = [
  {
    id: "cointelegraph",
    name: "CoinTelegraph",
    pic: "https://images.cointelegraph.com/images/240_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy9mODNlZjJiODc4ZjA0ZDVkOTM5NzRmOGNmODAwZjY1NC5wbmc=.png",
  },
  {
    id: "coindesk",
    name: "CoinDesk",
    pic: "https://www.coindesk.com/resizer/D1Fw_htYRqO8ZqKtgHlaDPXp9Qw=/2000x2000/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/coindesk/NBTJ3QQSUBDM7PJGFQB3NXKD2Y.png",
  },
  {
    id: "decrypt",
    name: "Decrypt",
    pic: "https://decrypt.co/static/images/favicon-256.png",
  },
  {
    id: "theblock",
    name: "The Block",
    pic: "https://www.tbstat.com/wp/uploads/2023/10/The-Block-Research.jpg",
  },
];

// CryptoCompare API configuration
export const BASE_URL = "https://min-api.cryptocompare.com/data/v2";
export const API_KEY = process.env.EXPO_PUBLIC_CRYPTOCOMPARE_API_KEY;

export const getNewsAPI = (category: string = "all") => {
  const categories = category !== "all" ? `&categories=${category}` : "";
  return `${BASE_URL}/news/?lang=EN${categories}&api_key=${API_KEY}`;
};

export const getSourceAPI = (source: string) => {
  return `${BASE_URL}/news/feeds?feeds=${source}&api_key=${API_KEY}`;
};
