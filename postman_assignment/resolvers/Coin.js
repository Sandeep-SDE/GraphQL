
const axios = require('axios');

exports.Query= {
  coins: async (parent, args) => {
    const response = await axios.get(
      args.currency
        ? `https://api.coinstats.app/public/v1/coins?currency=${args.currency}`
        : `https://api.coinstats.app/public/v1/coins`
    );
    let data = response.data.coins;
    if (args) {
      if (args.skip) {
        data = data.slice(args.skip, data.length);
      }
      if (args.limit) {
        data = data.slice(0, args.limit);
      }
    }
    return data;
  },
  coinAvg: async (parent, args) => {
    if (!args) {
      return null;
    } else {
      const response = await axios.get(
        `https://api.coinstats.app/public/v1/coins/${args.name}?currency=${args.currency}`
      );
      let data = response.data.coin;
      return data;
    }
  },
  coinChart: async (parent, args) => {
    if (!args) return null;
    const response = await axios.get(
      `https://api.coinstats.app/public/v1/charts?period=${args.period}&coinId=${args.coinId}`
    );
    let data = response.data.chart;
    return data;
  },
};

