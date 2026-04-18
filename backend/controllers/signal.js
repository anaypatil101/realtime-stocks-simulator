import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import Stock from '../models/stock.js';
import PriceHistory from '../models/price_history.js';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VALID_SIGNALS = ['Perfect Time to Buy', 'Good Time to Buy', 'Risky', 'Avoid', 'Insufficient Data'];

export const getStockSignal = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found.' });
    }

    const history = await PriceHistory.find({ ticker: stock.ticker })
      .sort({ recordedAt: -1 })
      .limit(30)
      .lean();

    if (history.length < 5) {
      return res.status(200).json({
        signal: 'Insufficient Data',
        reason: 'Not enough price history has been collected yet. Check back in a few minutes as the market runs.',
        disclaimer: 'Simulated prediction based on randomly generated price movement.',
      });
    }

    // Oldest first for the prompt so it reads chronologically
    const chronological = [...history].reverse();
    const prices = chronological.map((h) => h.price);

    const initialPrice = stock.initialPrice.toFixed(2);
    const currentPrice = stock.currentPrice.toFixed(2);
    const allTimeChange = (((stock.currentPrice - stock.initialPrice) / stock.initialPrice) * 100).toFixed(2);
    const priceList = prices.join(', ');

    const prompt = `You are a stock analysis assistant for a simulated trading platform. Prices are randomly generated and do not reflect real markets.

Stock details:
- Name: ${stock.name}
- Ticker: ${stock.ticker}
- Exchange: ${stock.exchange}
- Initial (starting) price: $${initialPrice}
- Current price: $${currentPrice}
- All-time change from initial: ${allTimeChange}%
- Industries: ${stock.industries.join(', ')}

Recent price history (oldest to newest, ${prices.length} data points):
${priceList}

Based on the recent price movement and all-time trend, classify the current buying opportunity into exactly one of these four categories:
- "Perfect Time to Buy" — strong upward momentum, price recently dipped and is recovering
- "Good Time to Buy" — mild positive trend, reasonable entry point
- "Risky" — high volatility or unclear trend, proceed with caution
- "Avoid" — strong downward trend or severely overbought, poor entry point

Respond with ONLY a valid JSON object and nothing else. No markdown, no explanation outside the JSON:
{"signal": "<one of the four categories above>", "reason": "<one concise sentence explaining why, referencing the price data>"}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content?.trim();

    let parsed;
    try {
      // Extract JSON even if the model wrapped it in markdown
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(200).json({
        signal: 'Insufficient Data',
        reason: 'The AI model returned an unexpected response. Please try again.',
        disclaimer: 'Simulated prediction based on randomly generated price movement.',
      });
    }

    const signal = VALID_SIGNALS.includes(parsed.signal) ? parsed.signal : 'Insufficient Data';
    const reason = typeof parsed.reason === 'string' ? parsed.reason : 'Unable to determine a reason.';

    return res.status(200).json({
      signal,
      reason,
      disclaimer: 'Simulated prediction based on randomly generated price movement.',
    });
  } catch (error) {
    console.log('Signal error:', error);
    return res.status(500).json({ message: 'An error occurred generating the signal.' });
  }
};
