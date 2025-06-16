// server.ts
// Your Express backend server, now fully integrated with Prisma and PostgreSQL for the e-commerce platform.
// This version includes API endpoints for the Super Admin Dashboard and enhanced product filtering/sorting,
// with CORRECTED TypeScript types and syntax for Request and Response to resolve errors.

import express from 'express'; // Import express directly
import { RequestHandler } from 'express'; // Import RequestHandler type
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // This middleware processes JSON bodies

// Type for a standard async Express route handler
type AsyncRequestHandler = RequestHandler;

// --- PUBLIC API Endpoints for E-commerce (Customer Facing) ---

// GET all products with optional filtering and sorting
app.get('/api/products', (async (req, res) => {
  console.log('GET /api/products requested with query:', req.query);
  const category = req.query.category as string | undefined;
  const isSale = req.query.isSale as string | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const where: any = {};
  const orderBy: any = {};

  if (category) {
    where.category = {
      name: category,
    };
  }

  if (isSale) {
    where.isSale = isSale === 'true';
  }

  if (sortBy === 'createdAt') {
    orderBy.createdAt = 'desc';
  } else if (sortBy === 'priceAsc') {
    orderBy.price = 'asc';
  } else if (sortBy === 'priceDesc') {
    orderBy.price = 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// GET a single product by ID
app.get('/api/products/:id', (async (req, res) => {
  const productId = parseInt(req.params.id as string); // Ensure params.id is treated as string for parseInt
  console.log(`GET /api/products/${productId} requested`);
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// GET all categories
app.get('/api/categories', (async (req, res) => {
  console.log('GET /api/categories requested');
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// GET all cities (wilayas)
app.get('/api/cities', (async (req, res) => {
  console.log('GET /api/cities requested');
  try {
    const cities = await prisma.city.findMany({
      include: {
        deliveryDesks: true
      }
    });
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// --- SUPER ADMIN DASHBOARD API Endpoints ---

// 1. Get all products with stock, isSale, and reference fields
app.get('/api/admin/products', (async (req, res) => {
  console.log('GET /api/admin/products requested (Admin View)');
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        reference: true,
        stock: true,
        isSale: true,
        price: true,
        oldPrice: true,
        category: { select: { name: true } },
        images: { select: { imagePath: true } },
        createdAt: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// 2. Find the top 10 most ordered products (by number of orders they appear in)
app.get('/api/admin/top-ordered-products', (async (req, res) => {
  console.log('GET /api/admin/top-ordered-products requested');
  try {
    const topOrderedProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 10,
    });

    const productIds = topOrderedProducts.map(item => item.productId);
    const productsWithDetails = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        reference: true,
        images: { select: { imagePath: true } },
      },
    });

    const result = topOrderedProducts.map((item: { productId: number; _count: { productId: number; }; }) => {
      const productDetail = productsWithDetails.find((p: { id: number; }) => p.id === item.productId);
      return {
        product: productDetail,
        orderCount: item._count.productId,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching top ordered products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// 3. Find the top 10 most sold products (by sum of quantities)
app.get('/api/admin/top-sold-products', (async (req, res) => {
  console.log('GET /api/admin/top-sold-products requested');
  try {
    const topSoldProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const productIds = topSoldProducts.map(item => item.productId);
    const productsWithDetails = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        reference: true,
        images: { select: { imagePath: true } },
      },
    });

    const result = topSoldProducts.map((item: { productId: number; _sum: { quantity: number | null; }; }) => {
      const productDetail = productsWithDetails.find((p: { id: number; }) => p.id === item.productId);
      return {
        product: productDetail,
        totalQuantitySold: item._sum.quantity,
      };
    });
    res.json(result); // Corrected syntax: this line was previously misaligned
  } catch (error) {
    console.error('Error fetching top sold products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here for the entire route handler

// 4. List orders grouped by callCenterStatus and deliveryStatus
app.get('/api/admin/orders-by-status', (async (req, res) => {
  console.log('GET /api/admin/orders-by-status requested');
  try {
    const ordersByStatus = await prisma.order.groupBy({
      by: ['callCenterStatus', 'deliveryStatus'],
      _count: {
        id: true,
      },
    });
    res.json(ordersByStatus);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// 5. List low stock products (stock < 5)
app.get('/api/admin/low-stock-products', (async (req, res) => {
  console.log('GET /api/admin/low-stock-products requested');
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lt: 5,
        },
      },
      select: {
        id: true,
        name: true,
        reference: true,
        stock: true,
        category: { select: { name: true } },
        images: { select: { imagePath: true } },
      },
      orderBy: {
        stock: 'asc',
      },
    });
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as AsyncRequestHandler); // Explicit cast here

// POST create a new order and decrement product stock
app.post('/api/orders', (async (req, res) => {
  console.log('POST /api/orders requested with body:', req.body);
  const { total, deliveryType, deliveryCityId, deliveryDeskId, address, clientNote, orderItems } = req.body;

  // Basic validation (more comprehensive validation is done by Zod on frontend)
  if (!total || !deliveryType || !deliveryCityId || !orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Missing required order details.' });
  }

  // Use a Prisma transaction to ensure atomicity:
  // Either the order is created and stock is decremented, or nothing happens.
  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Check stock for all items
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { name: true, stock: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`);
        }
      }

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: req.body.userId || null, // Assuming userId might come from a logged-in user
          total: parseFloat(total),
          deliveryType: deliveryType, // Make sure this matches Prisma Enum type ('HOME' | 'DESK')
          deliveryCityId: parseInt(deliveryCityId),
          deliveryDeskId: deliveryDeskId ? parseInt(deliveryDeskId) : null,
          address: address,
          clientNote: clientNote,
          callCenterStatus: 'NEW', // Default status
          deliveryStatus: 'NOT_READY', // Default status
          orderItems: {
            create: orderItems.map((item: any) => ({ // Map cart items to OrderItem creation data
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              price: item.price, // Price at the time of order
            })),
          },
        },
      });

      // 3. Decrement stock for each product in the order
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder; // Return the created order
    });

    res.status(201).json({ message: 'Order placed successfully!', orderId: order.id });
  } catch (error: any) { // Catch transaction errors
    console.error('Error placing order (transaction rolled back):', error);
    // Determine a user-friendly error message
    let errorMessage = 'Failed to place order. Please try again.';
    if (error.message.includes('Insufficient stock')) {
      errorMessage = error.message; // Use the specific stock error message
    }
    res.status(400).json({ message: errorMessage }); // 400 for client-side errors like insufficient stock
  }
}) as AsyncRequestHandler); // Ensure the handler is correctly typed as AsyncRequestHandler


// Basic root route
app.get('/', (async (req, res) => {
  res.send('E-commerce Backend API is running with Prisma and PostgreSQL. Explore public routes like /api/products, or admin routes like /api/admin/products');
}) as AsyncRequestHandler); // Explicit cast here

// Start the server
app.listen(PORT, () => {
  console.log(`E-commerce Express server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown:
// Disconnect Prisma Client when the Node.js process is about to exit.
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});