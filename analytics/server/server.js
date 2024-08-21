const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics', {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB", err));

const shopifyOrders = mongoose.model('shopifyOrders', new mongoose.Schema({}), 'shopifyOrders');
const shopifyCustomers = mongoose.model('shopifyCustomers', new mongoose.Schema({}), 'shopifyCustomers');

// Define the route for total sales over time
app.get('/api/sales/total-over-time', async (req, res) => {
  console.log("Request received:", req.query);

  const interval = req.query.interval || 'daily';
  let groupByFields = {};

  // Determine the grouping fields based on the interval
  switch (interval) {
    case 'monthly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        month: { $month: { $dateFromString: { dateString: "$created_at" } } },
      };
      break;

    case 'quarterly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        quarter: { $ceil: { $divide: [{ $month: { $dateFromString: { dateString: "$created_at" } } }, 3] } },
      };
      break;

    case 'yearly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
      };
      break;

    case 'daily':
    default:
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        month: { $month: { $dateFromString: { dateString: "$created_at" } } },
        day: { $dayOfMonth: { $dateFromString: { dateString: "$created_at" } } },
      };
  }

  try {
    const totalSales = await shopifyOrders.aggregate([
      {
        $group: {
          _id: groupByFields,
          totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // console.log("Total sales:", totalSales);
    res.json(totalSales);
  } catch (error) {
    console.error("Error in aggregation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/new-over-time', async (req, res) => {
  console.log("Request received:", req.query);

  const interval = req.query.interval || 'daily';
  let groupByFields = {};

  // Determine the grouping fields based on the interval
  switch (interval) {
    case 'monthly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        month: { $month: { $dateFromString: { dateString: "$created_at" } } },
      };
      break;

    case 'quarterly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        quarter: { $ceil: { $divide: [{ $month: { $dateFromString: { dateString: "$created_at" } } }, 3] } },
      };
      break;

    case 'yearly':
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
      };
      break;

    case 'daily':
    default:
      groupByFields = {
        year: { $year: { $dateFromString: { dateString: "$created_at" } } },
        month: { $month: { $dateFromString: { dateString: "$created_at" } } },
        day: { $dayOfMonth: { $dateFromString: { dateString: "$created_at" } } },
      };
  }
try{
  const newCustomers = await shopifyCustomers.aggregate([
    {
      $group: {
        _id: groupByFields,
        newCustomers: { $sum: 1 },
      },
    },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);
  // console.log("New customers:", newCustomers);
  res.json(newCustomers); 
}catch(error){
  console.error("Error in aggregation:", error);
  res.status(500).json({ error: error.message });
}
});

app.get('/api/customers/repeat-over-time', async (req, res) => {
  const interval = req.query.interval || 'monthly';
  let groupByFields = {};

  // Determine grouping fields based on the interval
  switch (interval) {
      case 'monthly':
          groupByFields = {
              year: { $year: { $dateFromString: { dateString: "$created_at" } } },
              month: { $month: { $dateFromString: { dateString: "$created_at" } } },
          };
          break;

      case 'quarterly':
          groupByFields = {
              year: { $year: { $dateFromString: { dateString: "$created_at" } } },
              quarter: { $ceil: { $divide: [{ $month: { $dateFromString: { dateString: "$created_at" } } }, 3] } },
          };
          break;

      case 'yearly':
          groupByFields = {
              year: { $year: { $dateFromString: { dateString: "$created_at" } } },
          };
          break;

      case 'daily':
      default:
          groupByFields = {
              year: { $year: { $dateFromString: { dateString: "$created_at" } } },
              month: { $month: { $dateFromString: { dateString: "$created_at" } } },
              day: { $dayOfMonth: { $dateFromString: { dateString: "$created_at" } } },
          };
  }

  try {
      // Aggregate purchases to find repeat customers
      const repeatCustomers = await shopifyOrders.aggregate([
          {
              $group: {
                  _id: groupByFields,
                  customerIds: { $addToSet: "$customer.id" }
              }
          },
          {
              $project: {
                  _id: 0,
                  timePeriod: "$_id",
                  customerCount: { $size: "$customerIds" }
              }
          },
          { $sort: { "timePeriod.year": 1, "timePeriod.month": 1, "timePeriod.day": 1 } }
      ]);
      console.log("Repeat customers:", repeatCustomers);
      res.json(repeatCustomers);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
