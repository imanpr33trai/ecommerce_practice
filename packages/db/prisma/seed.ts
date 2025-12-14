// import { Prisma.Decimal } from "./generated/";

import { PrismaPg } from "@prisma/adapter-pg";

import dotenv from "dotenv";
import { Pool } from "pg";
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  PrismaClient,
} from "../prisma/generated/client"; // path may differ

dotenv.config({
  path: "./.env",
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// Initialize Prisma Client

async function main() {
  console.log("Start seeding ...");

  // --- 1. CLEAN UP DATABASE ---
  console.log("Cleaning up database...");
  await prisma.review.deleteMany();
  await prisma.wish.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // --- 2. CREATE USERS ---
  console.log("Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_1",
        name: "Alice Johnson",
        email: "alice@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_2",
        name: "Bob Williams",
        email: "bob@example.com",

        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_3",
        name: "Charlie Brown",
        email: "charlie@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_4",
        name: "Diana Miller",
        email: "diana@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_5",
        name: "Ethan Davis",
        email: "ethan@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // --- 3. CREATE CATEGORIES (INCLUDING SUBCATEGORIES) ---
  console.log("Creating categories hierarchy...");

  // Top-level categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and devices",
    },
  });
  const furniture = await prisma.category.create({
    data: {
      name: "Furniture",
      slug: "furniture",
      description: "Home and office furnishings",
    },
  });
  const books = await prisma.category.create({
    data: {
      name: "Books",
      slug: "books",
      description: "Printed and digital literature",
    },
  });

  // Subcategories of Electronics
  const laptops = await prisma.category.create({
    data: {
      name: "Laptops",
      slug: "laptops",
      description: "Portable computing devices",
      parentId: electronics.id,
    },
  });
  const smartphones = await prisma.category.create({
    data: {
      name: "Smartphones",
      slug: "smartphones",
      description: "Mobile communication devices",
      parentId: electronics.id,
    },
  });

  // Subcategories of Furniture
  const sofas = await prisma.category.create({
    data: {
      name: "Sofas",
      slug: "sofas",
      description: "Comfortable seating for living rooms",
      parentId: furniture.id,
    },
  });
  const chairs = await prisma.category.create({
    data: {
      name: "Chairs",
      slug: "chairs",
      description: "Various types of seating chairs",
      parentId: furniture.id,
    },
  });

  // Sub-subcategory of Sofas
  const sectionalSofas = await prisma.category.create({
    data: {
      name: "Sectional Sofas",
      slug: "sectional-sofas",
      description: "Modular sofas for flexible seating",
      parentId: sofas.id,
    },
  });

  // Subcategories of Books
  const fiction = await prisma.category.create({
    data: {
      name: "Fiction",
      slug: "fiction",
      description: "Imaginative literary works",
      parentId: books.id,
    },
  });

  console.log(
    "Categories created:",
    [
      electronics.name,
      furniture.name,
      books.name,
      laptops.name,
      smartphones.name,
      sofas.name,
      chairs.name,
      sectionalSofas.name,
      fiction.name,
    ].join(", ")
  );

  // --- 4. CREATE PRODUCTS & IMAGES (ASSIGN TO SPECIFIC CATEGORIES) ---
  console.log("Creating products and images...");
  const products = await Promise.all([
    // Laptops
    prisma.product.create({
      data: {
        name: "Quantum Laptop X15",
        slug: "quantum-laptop-x15",
        description: "A high-performance laptop for professionals.",
        price: new Prisma.Decimal("1299.99"),
        stock: 50,
        sku: "ELEC-LP-001",
        categoryId: laptops.id,
        images: {
          create: [
            {
              url: "/images/danny.jpg",
              altText: "Quantum Laptop X15",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Lightweight Ultrabook",
        slug: "lightweight-ultrabook",
        description: "Slim and powerful ultrabook for on-the-go productivity.",
        price: new Prisma.Decimal("999.00"),
        stock: 75,
        sku: "ELEC-LP-002",
        categoryId: laptops.id,
        images: {
          create: [
            {
              url: "/images/mana.jpg",
              altText: "Lightweight Ultrabook",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    // Smartphones
    prisma.product.create({
      data: {
        name: "Photon Smartphone Pro",
        slug: "photon-smartphone-pro",
        description: "Latest generation smartphone with a stunning camera.",
        price: new Prisma.Decimal("799.50"),
        stock: 150,
        sku: "ELEC-SP-001",
        categoryId: smartphones.id,
        images: {
          create: [
            {
              url: "/images/manaad.jpg",
              altText: "Photon Smartphone Pro",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Compact Android Phone",
        slug: "compact-android-phone",
        description: "Powerful features in a pocket-friendly design.",
        price: new Prisma.Decimal("499.00"),
        stock: 200,
        sku: "ELEC-SP-002",
        categoryId: smartphones.id,
        images: {
          create: [
            {
              url: "/images/krisjanis.jpg",
              altText: "Compact Android Phone",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    // Sectional Sofas
    prisma.product.create({
      data: {
        name: "Modular Cloud Sofa",
        slug: "modular-cloud-sofa",
        description: "Extremely comfortable and reconfigurable modular sofa.",
        price: new Prisma.Decimal("2499.00"),
        stock: 20,
        sku: "FURN-SOF-001",
        categoryId: sectionalSofas.id,
        tags: ["newDeal"], // Example tag
        images: {
          create: [
            {
              url: "/images/pavlo.jpg",
              altText: "Modular Cloud Sofa",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "L-Shape Sectional",
        slug: "l-shape-sectional",
        description: "Spacious L-shaped sofa for family gatherings.",
        price: new Prisma.Decimal("1899.00"),
        stock: 30,
        sku: "FURN-SOF-002",
        categoryId: sectionalSofas.id,
        images: {
          create: [
            {
              url: "/images/rafael.jpg",
              altText: "L-Shape Sectional",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    // Chairs
    prisma.product.create({
      data: {
        name: "Ergonomic Office Chair",
        slug: "ergonomic-office-chair",
        description: "Designed for long hours of comfortable work.",
        price: new Prisma.Decimal("349.00"),
        stock: 80,
        sku: "FURN-CHR-001",
        categoryId: chairs.id,
        tags: ["exclusive"], // Example tag
        images: {
          create: [
            {
              url: "/images/danny.jpg",
              altText: "Ergonomic Office Chair",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Accent Armchair",
        slug: "accent-armchair",
        description: "Stylish armchair to complement any living space.",
        price: new Prisma.Decimal("199.00"),
        stock: 60,
        sku: "FURN-CHR-002",
        categoryId: chairs.id,
        images: {
          create: [
            {
              url: "/images/caroline.jpg",
              altText: "Accent Armchair",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    // Fiction Books
    prisma.product.create({
      data: {
        name: "The Midnight Library",
        slug: "the-midnight-library",
        description: "A profound and moving novel about life choices.",
        price: new Prisma.Decimal("14.99"),
        stock: 200,
        sku: "BOOK-FIC-001",
        categoryId: fiction.id,
        images: {
          create: [
            {
              url: "/images/danny.jpg",
              altText: "The Midnight Library book cover",
              isPrimary: true,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Project Hail Mary",
        slug: "project-hail-mary",
        description: "An enthralling sci-fi adventure from Andy Weir.",
        price: new Prisma.Decimal("16.50"),
        stock: 180,
        sku: "BOOK-FIC-002",
        categoryId: fiction.id,
        images: {
          create: [
            {
              url: "/images/danny.jpg",
              altText: "Project Hail Mary book cover",
              isPrimary: true,
            },
          ],
        },
      },
    }),
  ]);

  // --- 5. CREATE REVIEWS ---
  console.log("Creating reviews...");
  await prisma.review.createMany({
    data: [
      {
        productId: products[0].id,
        userId: users[0].id,
        rating: 5,
        comment: "Fantastic laptop, super fast!",
      },
      {
        productId: products[0].id,
        userId: users[1].id,
        rating: 4,
        comment: "Great value, minor battery issue.",
      },
      {
        productId: products[4].id,
        userId: users[2].id,
        rating: 5,
        comment: "Most comfortable sofa I've ever owned.",
      },
      {
        productId: products[6].id,
        userId: users[3].id,
        rating: 4,
        comment: "Good chair, took a while to assemble.",
      },
      {
        productId: products[8].id,
        userId: users[4].id,
        rating: 5,
        comment: "A truly captivating read.",
      },
    ],
  });

  // --- 6. CREATE ORDERS, ORDER ITEMS & PAYMENTS ---
  console.log("Creating orders...");
  await prisma.$transaction(async () => {
    // Order 1 for Alice
    const order1 = await prisma.order.create({
      data: {
        userId: users[0].id,
        totalAmount: 1314.98, // Laptop + Book
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.SUCCESS,
        items: {
          create: [
            { productId: products[0].id, quantity: 1 }, // Quantum Laptop
            { productId: products[8].id, quantity: 1 }, // Midnight Library
          ],
        },
      },
    });
    await prisma.payment.create({
      data: {
        orderId: order1.id,
        amount: order1.totalAmount,
        provider: "Stripe",
        status: PaymentStatus.SUCCESS,
        transactionId: "txn_alice_1",
      },
    });

    // Order 2 for Bob
    const order2 = await prisma.order.create({
      data: {
        userId: users[1].id,
        totalAmount: 2499.0, // Modular Cloud Sofa
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.SUCCESS,
        items: {
          create: [{ productId: products[4].id, quantity: 1 }],
        },
      },
    });
    await prisma.payment.create({
      data: {
        orderId: order2.id,
        amount: order2.totalAmount,
        provider: "PayPal",
        status: PaymentStatus.SUCCESS,
        transactionId: "txn_bob_1",
      },
    });

    // Order 3 for Charlie (Pending)
    await prisma.order.create({
      data: {
        userId: users[2].id,
        totalAmount: 799.5, // Photon Smartphone Pro
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        items: { create: [{ productId: products[2].id, quantity: 1 }] },
      },
    });
  });

  // --- 7. CREATE CARTS & CART ITEMS ---
  console.log("Creating carts...");
  await prisma.$transaction(async () => {
    // Cart for Diana (user_4) - ensure this is populated for frontend testing!
    const cartForDiana = await prisma.cart.create({
      data: {
        userId: users[3].id, // user_4
        items: {
          create: [
            { productId: products[1].id, quantity: 1 }, // Lightweight Ultrabook
            { productId: products[7].id, quantity: 1 }, // Accent Armchair
            { productId: products[9].id, quantity: 2 }, // Project Hail Mary (x2)
          ],
        },
      },
    });
    console.log(`Created cart for Diana (user_4) with ID: ${cartForDiana.id}`);

    // Cart for Ethan (user_5)
    await prisma.cart.create({
      data: {
        userId: users[4].id, // user_5
        items: {
          create: { productId: products[5].id, quantity: 1 }, // L-Shape Sectional
        },
      },
    });
  });

  // --- 8. CREATE WISHLISTS ---
  console.log("Creating wishlists...");
  await prisma.wish.createMany({
    data: [
      { userId: users[0].id, productId: products[2].id }, // Alice wants the phone
      { userId: users[1].id, productId: products[0].id }, // Bob wants the laptop
      { userId: users[2].id, productId: products[8].id }, // Charlie wants the book
      { userId: users[3].id, productId: products[6].id }, // Diana wants the office chair
      { userId: users[0].id, productId: products[9].id }, // Alice also wants Project Hail Mary
    ],
  });

  console.log("Seeding finished.");
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { PrismaClient, OrderStatus, PaymentStatus } from './generated/client';

// import { Prisma.Decimal } from '@prisma/client/runtime/library';

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// async function main() {
//   console.log('Start seeding ...');

//   // --- 1. CLEAN UP DATABASE ---
//   // Delete records in an order that respects foreign key constraints
//   console.log('Cleaning up database...');
//   await prisma.review.deleteMany();
//   await prisma.wish.deleteMany();
//   await prisma.cartItem.deleteMany();
//   await prisma.cart.deleteMany();
//   await prisma.payment.deleteMany();
//   await prisma.orderItem.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.image.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.category.deleteMany();
//   await prisma.user.deleteMany(); // Note: User-related tables like Account, Session are not seeded here but would also need cleanup

//   // --- 2. CREATE USERS ---
//   console.log('Creating users...');
//   const users = await Promise.all([
//     prisma.user.create({
//       data: {
//         id: 'w41biukrJLqZ0VEO9C9WeotKzhah0nf6',
//         name: 'Manpreet Singh',
//         email: 'manpreet.singh@gmail.com',
//         emailVerified: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     }),
//   ]);

//   // --- 3. CREATE CATEGORIES ---
//   console.log('Creating categories...');
//   const electronicsCategory = await prisma.category.create({
//     data: {
//       name: 'Electronics',
//       slug: 'electronics',
//       description: 'Gadgets and devices',
//     },
//   });

//   const apparelCategory = await prisma.category.create({
//     data: {
//       name: 'Apparel',
//       slug: 'apparel',
//       description: 'Clothing and fashion',
//     },
//   });

//   const booksCategory = await prisma.category.create({
//     data: {
//       name: 'Books',
//       slug: 'books',
//       description: 'Printed and digital books',
//     }
//   });

//   // --- 4. CREATE PRODUCTS & IMAGES ---
//   console.log('Creating products and images...');
//   const products = await Promise.all([
//     prisma.product.create({
//       data: {
//         name: 'Quantum Laptop',
//         slug: 'quantum-laptop',
//         description: 'A high-performance laptop for professionals.',
//         price: new Prisma.Decimal('1299.99'),
//         stock: 50,
//         sku: 'ELEC-LP-001',
//         isActive: true,
//         categoryId: electronicsCategory.id,
//         images: {
//           create: [
//             { url: '/images/aleksandr.jpg', altText: 'Front view of the Quantum Laptop', isPrimary: true },
//             { url: '/images/caroline.jpg', altText: 'Side view of the Quantum Laptop' },
//           ],
//         },
//       },
//     }),
//     prisma.product.create({
//       data: {
//         name: 'Photon Smartphone',
//         slug: 'photon-smartphone',
//         description: 'Latest generation smartphone with a stunning camera.',
//         price: new Prisma.Decimal('799.50'),
//         stock: 150,
//         sku: 'ELEC-SP-002',
//         isActive: true,
//         categoryId: electronicsCategory.id,
//         images: {
//           create: [{ url: '/images/danny.jpg', altText: 'Photon Smartphone', isPrimary: true }],
//         },
//       },
//     }),
//     prisma.product.create({
//       data: {
//         name: 'Classic Cotton T-Shirt',
//         slug: 'classic-cotton-t-shirt',
//         description: 'A comfortable and stylish 100% cotton t-shirt.',
//         price: new Prisma.Decimal('25.00'),
//         stock: 300,
//         sku: 'APP-TS-001',
//         isActive: true,
//         categoryId: apparelCategory.id,
//         images: {
//           create: [{ url: '/images/krisjanis.jpg', altText: 'Classic Cotton T-Shirt', isPrimary: true }],
//         },
//       },
//     }),
//     prisma.product.create({
//       data: {
//         name: 'Designer Denim Jeans',
//         slug: 'designer-denim-jeans',
//         description: 'Premium quality denim jeans for all occasions.',
//         price: new Prisma.Decimal('89.99'),
//         stock: 120,
//         sku: 'APP-JN-002',
//         isActive: true,
//         categoryId: apparelCategory.id,
//         images: {
//           create: [{ url: '/images/mana.jpg', altText: 'Designer Denim Jeans', isPrimary: true }],
//         },
//       },
//     }),
//     prisma.product.create({
//       data: {
//         name: 'The Art of Programming',
//         slug: 'the-art-of-programming',
//         description: 'A comprehensive guide to modern software development.',
//         price: new Prisma.Decimal('49.95'),
//         stock: 200,
//         sku: 'BOOK-CS-001',
//         isActive: true,
//         categoryId: booksCategory.id,
//         images: {
//           create: [{ url: '/images/manaad.jpg', altText: 'The Art of Programming Book Cover', isPrimary: true }],
//         },
//       },
//     }),
//   ]);

//   // --- 5. CREATE REVIEWS ---
//   console.log('Creating reviews...');
//   await prisma.review.createMany({
//     data: [
//       { productId: products[0].id, userId: users[0].id, rating: 5, comment: "Absolutely fantastic laptop! Fast and reliable." },
//       { productId: products[0].id, userId: users[0].id, rating: 4, comment: "Great value, but the battery life could be better." },
//       { productId: products[2].id, userId: users[0].id, rating: 5, comment: "So soft and fits perfectly. I'm buying more!" },
//       { productId: products[4].id, userId: users[0].id, rating: 4, comment: "A must-read for any aspiring developer." },
//       { productId: products[1].id, userId: users[0].id, rating: 5, comment: "The camera on this phone is unbelievable." },
//     ],
//   });

//   // --- 6. CREATE ORDERS, ORDER ITEMS & PAYMENTS ---
//   console.log('Creating orders...');
//   const order1 = await prisma.order.create({
//     data: {
//       userId: users[0].id,
//       totalAmount: 1324.99, // Laptop + T-shirt
//       status: OrderStatus.DELIVERED,
//       paymentStatus: PaymentStatus.SUCCESS,
//       items: {
//         create: [
//           { productId: products[0].id, quantity: 1 },
//           { productId: products[2].id, quantity: 1 },
//         ],
//       },
//       payment: {
//         create: { amount: new Prisma.Decimal('1324.99'), provider: 'Stripe', status: PaymentStatus.SUCCESS, transactionId: 'txn_1' }
//       }
//     },
//   });

//   const order2 = await prisma.order.create({
//     data: {
//       userId: users[0].id,
//       totalAmount: 179.98, // 2x Jeans
//       status: OrderStatus.SHIPPED,
//       paymentStatus: PaymentStatus.SUCCESS,
//       items: {
//         create: [
//           { productId: products[3].id, quantity: 2 },
//         ],
//       },
//       payment: {
//         create: { amount: new Prisma.Decimal('179.98'), provider: 'PayPal', status: PaymentStatus.SUCCESS, transactionId: 'txn_2' }
//       }
//     },
//   });

//   const order3 = await prisma.order.create({
//     data: {
//       userId: users[0].id,
//       totalAmount: 799.50, // Smartphone
//       status: OrderStatus.PENDING,
//       paymentStatus: PaymentStatus.PENDING,
//       items: { create: [{ productId: products[1].id, quantity: 1 }] },
//     },
//   });

//   // --- 7. CREATE CARTS & CART ITEMS ---
//   console.log('Creating carts...');
//   await prisma.cart.create({
//     data: {
//       userId: users[0].id,
//       items: {
//         create: [
//           { productId: products[4].id, quantity: 1 }, // Book
//           { productId: products[2].id, quantity: 2 }, // T-shirts
//         ],
//       },
//     },
//   });

//   // --- 8. CREATE WISHLISTS ---
//   console.log('Creating wishlists...');
//   await prisma.wish.createMany({
//     data: [
//       { userId: users[0].id, productId: products[1].id }, // Alice wants the phone
//       { userId: users[0].id, productId: products[0].id }, // Bob wants the laptop
//       { userId: users[0].id, productId: products[4].id }, // Charlie wants the book
//       { userId: users[0].id, productId: products[3].id }, // Diana wants the jeans
//       // { userId: users[0].id, productId: products[4].id }, // Alice also wants the book
//     ],
//   });

//   console.log('Seeding finished.');
// }

// // Execute the main function
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     // Close the Prisma Client connection
//     await prisma.$disconnect();
//   });

// prisma/schema/category.prisma
// model Category {
//     id          String    @id @default(cuid())
//     name        String
//     description String?
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     slug        String    @unique // Essential for routing
//     parentId    String?   // Foreign key for the parent category

//     // Self-referencing relations:
//     parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
//     children    Category[] @relation("CategoryHierarchy") // List of immediate subcategories

//     products    Product[]
// }
// ```After making this change, run `npx prisma db push` or `npx prisma migrate dev` followed by `npx prisma generate` to update your database schema and Prisma Client.

// ---

// ### **Updated `prisma/seed.ts` with Subcategories**

// This script will:
// 1.  Clean the database.
// 2.  Create users.
// 3.  Create a structured hierarchy of categories (top-level and subcategories).
// 4.  Create products and assign them to specific categories (including subcategories).
// 5.  Create reviews, orders, cart items, and wishlists, linking them to the new data.

// ```typescript
