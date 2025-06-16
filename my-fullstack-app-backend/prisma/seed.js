// prisma/seed.js
// This script populates your database with initial data for categories, products, cities, and delivery desks.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial e-commerce data...');

  // --- Clear existing data (optional, for clean re-seeding during development) ---
  // This block is safe to keep. If tables are empty, it just means there's nothing to delete.
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.deliveryDesk.deleteMany({});
    await prisma.city.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Cleared existing data from all tables.');
  } catch (e) {
    // We expect this to fail gracefully if tables don't exist yet (e.g., first run after db push)
    // or if there's no data. Logging for debugging, but not a fatal error for seeding.
    console.warn('Could not clear existing data (may be empty tables or initial run):', e.message);
  }

  // --- Create Users (Super Admin, Call Center, Delivery, Customer) ---
  const superAdmin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@example.com', password: 'hashedpassword', role: 'SUPERADMIN' },
  });
  const callCenterAgent = await prisma.user.create({
    data: { name: 'Call Agent', email: 'callcenter@example.com', password: 'hashedpassword', role: 'CALLCENTER' },
  });
  const deliveryAgent = await prisma.user.create({
    data: { name: 'Delivery Guy', email: 'delivery@example.com', password: 'hashedpassword', role: 'DELIVERY' },
  });
  const customer = await prisma.user.create({
    data: { name: 'Test Customer', email: 'customer@example.com', password: 'hashedpassword', role: 'CUSTOMER' },
  });
  console.log('Users created.');

  // --- Create Categories ---
  const electronicsCategory = await prisma.category.create({ data: { name: 'Electronics' } });
  const apparelCategory = await prisma.category.create({ data: { name: 'Apparel' } });
  const homeGoodsCategory = await prisma.category.create({ data: { name: 'Home Goods' } });
  const booksCategory = await prisma.category.create({ data: { name: 'Books' } });
  console.log('Categories created.');

  // --- Create Products ---
  const productsToSeed = [
    {
      name: 'Wireless Bluetooth Headphones',
      reference: 'HEAD-BT-001',
      description: 'High-fidelity sound with noise-cancellation. Perfect for travel and daily commute.',
      price: 99.99,
      category: { connect: { id: electronicsCategory.id } },
      stock: 50,
      sizes: ['N/A'],
      images: {
        create: [
          { color: 'Black', imagePath: 'https://placehold.co/400x300/ADD8E6/000000?text=Headphones_Black' },
          { color: 'Silver', imagePath: 'https://placehold.co/400x300/C0C0C0/000000?text=Headphones_Silver' },
        ],
      },
    },
    {
      name: 'Men\'s Casual T-Shirt',
      reference: 'TSHIRT-M-002',
      description: 'Comfortable 100% cotton t-shirt for everyday wear.',
      price: 19.99,
      oldPrice: 25.00,
      isSale: true,
      category: { connect: { id: apparelCategory.id } },
      stock: 120,
      sizes: ['S', 'M', 'L', 'XL'],
      images: {
        create: [
          { color: 'Blue', imagePath: 'https://placehold.co/400x300/AEC6CF/000000?text=T-Shirt_Blue' },
          { color: 'Red', imagePath: 'https://placehold.co/400x300/FF6961/000000?text=T-Shirt_Red' },
        ],
      },
    },
    {
      name: 'Learn Prisma in 7 Days',
      reference: 'BOOK-PRISMA-003',
      description: 'A comprehensive guide to mastering Prisma ORM.',
      price: 35.00,
      category: { connect: { id: booksCategory.id } },
      stock: 75,
      sizes: ['N/A'],
      images: {
        create: [
          { imagePath: 'https://placehold.co/400x300/DDA0DD/000000?text=Book_Cover' },
        ],
      },
    },
    {
      name: 'Deluxe Coffee Machine',
      reference: 'COFFEE-DELUXE-004',
      description: 'Brew professional-grade coffee at home.',
      price: 249.99,
      category: { connect: { id: homeGoodsCategory.id } },
      stock: 10,
      sizes: ['N/A'],
      images: {
        create: [
          { imagePath: 'https://placehold.co/400x300/B0E0E6/000000?text=Coffee+Machine_Front' },
        ],
      },
    },
  ];

  for (const productData of productsToSeed) {
    await prisma.product.create({
      data: {
        name: productData.name,
        reference: productData.reference,
        description: productData.description,
        price: productData.price,
        oldPrice: productData.oldPrice,
        isSale: productData.isSale,
        sizes: productData.sizes,
        stock: productData.stock,
        categoryId: productData.category.connect.id,
        ...(productData.images && { images: productData.images }),
      },
    });
  }
  console.log('Products created.');

  // --- Create Cities (Wilayas) and Delivery Desks ---
  // CORRECTED: Removed duplicate city names.
  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
    "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
    "Ouled Djellal", "Béni Abbès", "Touggourt", "Djanet", "El M'Ghair", "El Menia" // Removed duplicate "Timimoun", and the last few were not standard wilaya names, replaced with valid ones for Algeria (total 58)
  ];

  for (const wilayaName of wilayas) {
    const homeFee = parseFloat((Math.random() * (800 - 400) + 400).toFixed(2));
    const city = await prisma.city.create({
      data: {
        name: wilayaName,
        homeFee: homeFee,
      },
    });

    // Add 2-3 delivery desks per city
    const numDesks = Math.floor(Math.random() * 2) + 2; // 2 or 3 desks
    for (let i = 1; i <= numDesks; i++) {
      const deskFee = parseFloat((Math.random() * (400 - 200) + 200).toFixed(2));
      await prisma.deliveryDesk.create({
        data: {
          name: `${wilayaName} Desk ${i}`,
          deskFee: deskFee,
          cityId: city.id,
        },
      });
    }
  }
  console.log('Cities and Delivery Desks created.');

  // --- Create a sample Coupon ---
  await prisma.coupon.create({
    data: {
      code: 'WELCOME20',
      discountPercent: 20,
      active: true,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Valid for 1 year
    },
  });
  console.log('Coupon created.');

  // --- Create a sample Order to demonstrate relations ---
  // Assuming a customer, product, city, and delivery desk already exist from seeding
  const sampleProduct = await prisma.product.findFirst({ where: { name: 'Men\'s Casual T-Shirt' } });
  const sampleCity = await prisma.city.findFirst({ where: { name: 'Algiers' } });
  const sampleDeliveryDesk = await prisma.deliveryDesk.findFirst({ where: { cityId: sampleCity?.id } });


  if (customer && sampleProduct && sampleCity && sampleDeliveryDesk) {
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        total: sampleProduct.price * 2, // Example total
        deliveryType: 'DESK',
        deliveryCityId: sampleCity.id,
        deliveryDeskId: sampleDeliveryDesk.id,
        clientNote: 'Please handle with care.',
        orderItems: {
          create: [
            {
              productId: sampleProduct.id,
              quantity: 2,
              size: 'M',
              price: sampleProduct.price, // Price at time of order
            },
          ],
        },
      },
    });
    console.log(`Sample order created for user ${customer.name} in ${sampleCity.name}.`);
  } else {
    console.warn('Could not create sample order: missing customer, product, city, or delivery desk.');
  }

  console.log('Database seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });