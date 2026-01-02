import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Stock from './models/stock.js';
import User from './models/user.js';
import PurchasedStock from './models/purchased_stock.js';
import Transaction from './models/transaction.js';
import ActionLog from './models/action_log.js';

// Load environment variables
dotenv.config();

const CONNECTION_URL = process.env.MONGO_CONNECTION_STRING;

// Sample stock data
const stocksData = [
  {
    id: 1,
    ticker: 'AAPL',
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    initialPrice: 150.25,
    currentPrice: 175.50,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    ipoDate: '1980-12-12',
    siteUrl: 'https://www.apple.com',
    industries: ['Technology', 'Consumer Electronics'],
    icon: '🍎',
    favorited: false
  },
  {
    id: 2,
    ticker: 'GOOGL',
    exchange: 'NASDAQ',
    name: 'Alphabet Inc.',
    initialPrice: 2500.00,
    currentPrice: 2750.30,
    description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    ipoDate: '2004-08-19',
    siteUrl: 'https://www.google.com',
    industries: ['Technology', 'Internet'],
    icon: '🔍',
    favorited: false
  },
  {
    id: 3,
    ticker: 'MSFT',
    exchange: 'NASDAQ',
    name: 'Microsoft Corporation',
    initialPrice: 300.00,
    currentPrice: 380.75,
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    ipoDate: '1986-03-13',
    siteUrl: 'https://www.microsoft.com',
    industries: ['Technology', 'Software'],
    icon: '🪟',
    favorited: false
  },
  {
    id: 4,
    ticker: 'AMZN',
    exchange: 'NASDAQ',
    name: 'Amazon.com Inc.',
    initialPrice: 3200.00,
    currentPrice: 3400.50,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
    ipoDate: '1997-05-15',
    siteUrl: 'https://www.amazon.com',
    industries: ['E-commerce', 'Cloud Computing'],
    icon: '📦',
    favorited: false
  },
  {
    id: 5,
    ticker: 'TSLA',
    exchange: 'NASDAQ',
    name: 'Tesla, Inc.',
    initialPrice: 800.00,
    currentPrice: 950.25,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
    ipoDate: '2010-06-29',
    siteUrl: 'https://www.tesla.com',
    industries: ['Automotive', 'Energy'],
    icon: '⚡',
    favorited: false
  },
  {
    id: 6,
    ticker: 'META',
    exchange: 'NASDAQ',
    name: 'Meta Platforms, Inc.',
    initialPrice: 350.00,
    currentPrice: 420.80,
    description: 'Meta Platforms, Inc. engages in the development of products that help people connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
    ipoDate: '2012-05-18',
    siteUrl: 'https://www.meta.com',
    industries: ['Technology', 'Social Media'],
    icon: '📘',
    favorited: false
  },
  {
    id: 7,
    ticker: 'NVDA',
    exchange: 'NASDAQ',
    name: 'NVIDIA Corporation',
    initialPrice: 450.00,
    currentPrice: 520.60,
    description: 'NVIDIA Corporation provides graphics and compute and networking solutions in the United States, Taiwan, China, and internationally.',
    ipoDate: '1999-01-22',
    siteUrl: 'https://www.nvidia.com',
    industries: ['Technology', 'Semiconductors'],
    icon: '🎮',
    favorited: false
  },
  {
    id: 8,
    ticker: 'JPM',
    exchange: 'NYSE',
    name: 'JPMorgan Chase & Co.',
    initialPrice: 150.00,
    currentPrice: 165.40,
    description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.',
    ipoDate: '1969-12-31',
    siteUrl: 'https://www.jpmorganchase.com',
    industries: ['Finance', 'Banking'],
    icon: '🏦',
    favorited: false
  },
  {
    id: 9,
    ticker: 'V',
    exchange: 'NYSE',
    name: 'Visa Inc.',
    initialPrice: 200.00,
    currentPrice: 235.90,
    description: 'Visa Inc. operates as a payments technology company worldwide.',
    ipoDate: '2008-03-19',
    siteUrl: 'https://www.visa.com',
    industries: ['Finance', 'Payment Processing'],
    icon: '💳',
    favorited: false
  },
  {
    id: 10,
    ticker: 'JNJ',
    exchange: 'NYSE',
    name: 'Johnson & Johnson',
    initialPrice: 170.00,
    currentPrice: 180.25,
    description: 'Johnson & Johnson researches and develops, manufactures, and sells various products in the healthcare field worldwide.',
    ipoDate: '1944-09-24',
    siteUrl: 'https://www.jnj.com',
    industries: ['Healthcare', 'Pharmaceuticals'],
    icon: '💊',
    favorited: false
  },
  {
    id: 11,
    ticker: 'WMT',
    exchange: 'NYSE',
    name: 'Walmart Inc.',
    initialPrice: 140.00,
    currentPrice: 155.80,
    description: 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.',
    ipoDate: '1970-10-01',
    siteUrl: 'https://www.walmart.com',
    industries: ['Retail', 'Consumer Goods'],
    icon: '🛒',
    favorited: false
  },
  {
    id: 12,
    ticker: 'PG',
    exchange: 'NYSE',
    name: 'The Procter & Gamble Company',
    initialPrice: 150.00,
    currentPrice: 165.30,
    description: 'The Procter & Gamble Company provides branded consumer packaged goods to consumers in North and Latin America, Europe, the Asia Pacific, Greater China, India, the Middle East, and Africa.',
    ipoDate: '1950-01-01',
    siteUrl: 'https://www.pg.com',
    industries: ['Consumer Goods', 'Household Products'],
    icon: '🧴',
    favorited: false
  },
  {
    id: 13,
    ticker: 'MA',
    exchange: 'NYSE',
    name: 'Mastercard Incorporated',
    initialPrice: 380.00,
    currentPrice: 410.50,
    description: 'Mastercard Incorporated, a technology company, provides transaction processing and payment-related products and services in the United States and internationally.',
    ipoDate: '2006-05-25',
    siteUrl: 'https://www.mastercard.com',
    industries: ['Finance', 'Payment Processing'],
    icon: '💳',
    favorited: false
  },
  {
    id: 14,
    ticker: 'DIS',
    exchange: 'NYSE',
    name: 'The Walt Disney Company',
    initialPrice: 180.00,
    currentPrice: 195.60,
    description: 'The Walt Disney Company, together with its subsidiaries, operates as an entertainment company worldwide.',
    ipoDate: '1957-11-12',
    siteUrl: 'https://www.disney.com',
    industries: ['Entertainment', 'Media'],
    icon: '🏰',
    favorited: false
  },
  {
    id: 15,
    ticker: 'NFLX',
    exchange: 'NASDAQ',
    name: 'Netflix, Inc.',
    initialPrice: 450.00,
    currentPrice: 480.25,
    description: 'Netflix, Inc. provides entertainment services. It offers TV series, documentaries, and feature films across various genres and languages.',
    ipoDate: '2002-05-23',
    siteUrl: 'https://www.netflix.com',
    industries: ['Entertainment', 'Streaming'],
    icon: '📺',
    favorited: false
  },
  {
    id: 16,
    ticker: 'AMD',
    exchange: 'NASDAQ',
    name: 'Advanced Micro Devices, Inc.',
    initialPrice: 100.00,
    currentPrice: 125.40,
    description: 'Advanced Micro Devices, Inc. operates as a semiconductor company worldwide.',
    ipoDate: '1979-09-01',
    siteUrl: 'https://www.amd.com',
    industries: ['Technology', 'Semiconductors'],
    icon: '💻',
    favorited: false
  },
  {
    id: 17,
    ticker: 'INTC',
    exchange: 'NASDAQ',
    name: 'Intel Corporation',
    initialPrice: 55.00,
    currentPrice: 48.30,
    description: 'Intel Corporation designs, manufactures, and sells computer, networking, data storage, and communication platforms worldwide.',
    ipoDate: '1971-10-13',
    siteUrl: 'https://www.intel.com',
    industries: ['Technology', 'Semiconductors'],
    icon: '🔧',
    favorited: false
  },
  {
    id: 18,
    ticker: 'COST',
    exchange: 'NASDAQ',
    name: 'Costco Wholesale Corporation',
    initialPrice: 450.00,
    currentPrice: 520.80,
    description: 'Costco Wholesale Corporation, together with its subsidiaries, engages in the operation of membership warehouses.',
    ipoDate: '1985-10-01',
    siteUrl: 'https://www.costco.com',
    industries: ['Retail', 'Wholesale'],
    icon: '🛍️',
    favorited: false
  },
  {
    id: 19,
    ticker: 'PEP',
    exchange: 'NASDAQ',
    name: 'PepsiCo, Inc.',
    initialPrice: 160.00,
    currentPrice: 175.90,
    description: 'PepsiCo, Inc. operates as a food and beverage company worldwide.',
    ipoDate: '1972-01-01',
    siteUrl: 'https://www.pepsico.com',
    industries: ['Food & Beverage', 'Consumer Goods'],
    icon: '🥤',
    favorited: false
  },
  {
    id: 20,
    ticker: 'CSCO',
    exchange: 'NASDAQ',
    name: 'Cisco Systems, Inc.',
    initialPrice: 55.00,
    currentPrice: 58.40,
    description: 'Cisco Systems, Inc. designs, manufactures, and sells Internet Protocol based networking and other products related to the communications and information technology industry worldwide.',
    ipoDate: '1990-02-16',
    siteUrl: 'https://www.cisco.com',
    industries: ['Technology', 'Networking'],
    icon: '🌐',
    favorited: false
  }
];

// Sample user data
const usersData = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    coins: 10000
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    coins: 15000
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    password: 'password123',
    coins: 8000
  },
  {
    id: 'user4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    password: 'password123',
    coins: 12000
  },
  {
    id: 'user5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    password: 'password123',
    coins: 20000
  }
];

// Function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB successfully!');

    // Clear existing data
    console.log('\nClearing existing data...');
    await Stock.deleteMany({});
    await User.deleteMany({});
    await PurchasedStock.deleteMany({});
    await Transaction.deleteMany({});
    await ActionLog.deleteMany({});
    console.log('Existing data cleared!');

    // Seed Stocks
    console.log('\nSeeding stocks...');
    const stocks = await Stock.insertMany(stocksData);
    console.log(`✓ Inserted ${stocks.length} stocks`);

    // Seed Users (with hashed passwords)
    console.log('\nSeeding users...');
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password)
      }))
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✓ Inserted ${users.length} users`);

    // Seed Purchased Stocks
    console.log('\nSeeding purchased stocks...');
    const purchasedStocksData = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Each user purchases 2-4 different stocks
      const numPurchases = Math.floor(Math.random() * 3) + 2;
      const selectedStocks = stocks
        .sort(() => 0.5 - Math.random())
        .slice(0, numPurchases);

      for (const stock of selectedStocks) {
        const shares = Math.floor(Math.random() * 10) + 1;
        const purchasePrice = stock.currentPrice;
        const initialInvestment = shares * purchasePrice;

        purchasedStocksData.push({
          userId: user.id,
          stock: stock._id,
          tickerBought: stock.ticker,
          shares: shares,
          initialInvestment: initialInvestment
        });
      }
    }
    const purchasedStocks = await PurchasedStock.insertMany(purchasedStocksData);
    console.log(`✓ Inserted ${purchasedStocks.length} purchased stocks`);

    // Seed Transactions
    console.log('\nSeeding transactions...');
    const transactionsData = [];
    for (const purchasedStock of purchasedStocks) {
      transactionsData.push({
        userId: purchasedStock.userId,
        transactionType: 'BUY',
        tickerBought: purchasedStock.tickerBought,
        shares: purchasedStock.shares,
        investment: purchasedStock.initialInvestment,
        transactedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
    }
    const transactions = await Transaction.insertMany(transactionsData);
    console.log(`✓ Inserted ${transactions.length} transactions`);

    // Seed Action Logs
    console.log('\nSeeding action logs...');
    const actionLogsData = [];
    const logActions = ['LOGIN', 'LOGOUT', 'BUY_STOCK', 'SELL_STOCK', 'VIEW_STOCK', 'UPDATE_PROFILE'];

    for (const user of users) {
      // Each user has 5-10 action logs
      const numLogs = Math.floor(Math.random() * 6) + 5;
      for (let i = 0; i < numLogs; i++) {
        const action = logActions[Math.floor(Math.random() * logActions.length)];
        const logEntry = {
          userId: user.id,
          logAction: action,
          loggedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        };

        // Add ticker and shares for stock-related actions
        if (action === 'BUY_STOCK' || action === 'SELL_STOCK' || action === 'VIEW_STOCK') {
          const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
          logEntry.tickerBought = randomStock.ticker;
          logEntry.shares = Math.floor(Math.random() * 10) + 1;
        }

        actionLogsData.push(logEntry);
      }
    }
    const actionLogs = await ActionLog.insertMany(actionLogsData);
    console.log(`✓ Inserted ${actionLogs.length} action logs`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log(`Stocks: ${stocks.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Purchased Stocks: ${purchasedStocks.length}`);
    console.log(`Transactions: ${transactions.length}`);
    console.log(`Action Logs: ${actionLogs.length}`);
    console.log('='.repeat(50));

    // Close connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

