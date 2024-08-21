const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS to allow requests from your frontend
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to match your frontend's origin
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB", err));

const shopifyOrders = mongoose.model('shopifyOrders', new mongoose.Schema({}), 'shopifyOrders');

// Define the route for total sales over time
app.get('/api/sales/total-over-time', async (req, res) => {
    console.log("Request received:", req.query);
  const interval = req.query.interval || 'daily'; // default to daily if not specified
  let groupId;
  
  // Determine the grouping interval
  switch (interval) {
    case 'monthly':
      groupId = {
        year: { $year: '$created_at' },
        month: { $month: '$created_at' },
      };
      break;

    case 'quarterly':
      groupId = {
        year: { $year: '$created_at' },
        quarter: { $ceil: { $divide: [{ $month: '$created_at' }, 3] } }
      };
      break;

    case 'yearly':
      groupId = { year: { $year: '$created_at' } };
      break;

    case 'daily':
    default:
      groupId = {
        year: { $year: '$created_at' },
        month: { $month: '$created_at' },
        day: { $dayOfMonth: '$created_at' },
      };
  }
  console.log("Group ID:", groupId);
  try {
    const totalSales = await shopifyOrders.aggregate([
        {
          $addFields: {
            amount: {
              $cond: { if: { $eq: ["$total_price_set.shop_money.amount", ""] }, then: "0", else: "$total_price_set.shop_money.amount" }
            }
          }
        },
        {
          $group: {
            _id: 1,
            totalSales: { $sum: { $toDouble: "$amount" } },
          },
        },
        { $sort: { "_id": 1 } }
      ]);
  
    console.log("Total sales:", totalSales);
    res.json(totalSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
