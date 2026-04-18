import Stock from '../models/stock.js';
import PriceHistory from '../models/price_history.js';

const delay = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const stockPrice = async (socket, currPrice, delayMs, stockTicker, fluctuationRange, stockId) => {
  try {
    let price = currPrice;
    let tickCount = 0;

    while (socket.connected) {
      let up = Math.round(Math.random());
      if (up) {
        price += Math.random() * fluctuationRange;
        up = false;
      } else {
        price -= Math.random() * fluctuationRange;
        up = true;
      }
      if (price < 0) {
        price = 0;
      }

      const updatedStock = await Stock.findOneAndUpdate({ id: stockId }, { currentPrice: price }, { new: true });
      socket.emit(stockTicker, price.toFixed(2));

      // Record price history every 10th tick (~15-30s of real time)
      if (tickCount % 10 === 0 && updatedStock) {
        await PriceHistory.create({
          stockId: updatedStock._id,
          ticker: stockTicker,
          price: parseFloat(price.toFixed(2)),
        });
      }

      tickCount++;
      await delay(delayMs);
    }
  } catch (error) {
    socket.disconnect();
    console.log("Market error", error);
  }
}

export { stockPrice }
