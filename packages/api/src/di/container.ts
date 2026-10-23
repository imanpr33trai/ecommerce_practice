import type { UserRepository } from "../repositories/user.repository.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { CartRepository } from "../repositories/cart.repository.js";
import type { WishlistRepository } from "../repositories/wishlist.repository.js";
import type { ReviewRepository } from "../repositories/review.repository.js";
import type { AddressRepository } from "../repositories/address.repository.js";
import type { OrderRepository } from "../repositories/order.repository.js";

import type { UserService } from "../services/UserService.js";
import type { ProductService } from "../services/ProductService.js";
import type { CartService } from "../services/CartService.js";
import type { OrderService } from "../services/OrderService.js";
import type { ReviewService } from "../services/ReviewService.js";
import type { AddressService } from "../services/AddressService.js";
import type { WishlistService } from "../services/WishlistService.js";

/**
 * DI Container Interface
 * Defines all repositories and services that can be resolved from the container
 */
export interface DIContainer {
  // Repositories
  userRepository: UserRepository;
  productRepository: ProductRepository;
  cartRepository: CartRepository;
  wishlistRepository: WishlistRepository;
  reviewRepository: ReviewRepository;
  addressRepository: AddressRepository;
  orderRepository: OrderRepository;

  // Services
  userService: UserService;
  productService: ProductService;
  cartService: CartService;
  orderService: OrderService;
  reviewService: ReviewService;
  addressService: AddressService;
  wishlistService: WishlistService;

  // Factory methods for per-request scoped instances
  createRequestScope(): DIContainer;
}

/**
 * Container configuration - holds factory functions for creating instances
 */
interface ContainerConfig {
  userRepository: () => UserRepository;
  productRepository: () => ProductRepository;
  cartRepository: () => CartRepository;
  wishlistRepository: () => WishlistRepository;
  reviewRepository: () => ReviewRepository;
  addressRepository: () => AddressRepository;
  orderRepository: () => OrderRepository;
  userService: (deps: { userRepository: UserRepository }) => UserService;
  productService: (deps: { productRepository: ProductRepository }) => ProductService;
  cartService: (deps: { cartRepository: CartRepository }) => CartService;
  orderService: (deps: {
    orderRepository: OrderRepository;
    cartRepository: CartRepository;
    addressRepository: AddressRepository;
    productRepository: ProductRepository;
  }) => OrderService;
  reviewService: (deps: { reviewRepository: ReviewRepository; productRepository: ProductRepository }) => ReviewService;
  addressService: (deps: { addressRepository: AddressRepository }) => AddressService;
  wishlistService: (deps: { wishlistRepository: WishlistRepository; productRepository: ProductRepository }) => WishlistService;
}

/**
 * Creates a new DI container with the given configuration
 */
export function createContainer(config: ContainerConfig): DIContainer {
  // Singleton instances (shared across requests)
  let userRepositoryInstance: UserRepository;
  let productRepositoryInstance: ProductRepository;
  let cartRepositoryInstance: CartRepository;
  let wishlistRepositoryInstance: WishlistRepository;
  let reviewRepositoryInstance: ReviewRepository;
  let addressRepositoryInstance: AddressRepository;
  let orderRepositoryInstance: OrderRepository;

  let userServiceInstance: UserService;
  let productServiceInstance: ProductService;
  let cartServiceInstance: CartService;
  let orderServiceInstance: OrderService;
  let reviewServiceInstance: ReviewService;
  let addressServiceInstance: AddressService;
  let wishlistServiceInstance: WishlistService;

  const container: DIContainer = {
    get userRepository() {
      if (!userRepositoryInstance) {
        userRepositoryInstance = config.userRepository();
      }
      return userRepositoryInstance;
    },

    get productRepository() {
      if (!productRepositoryInstance) {
        productRepositoryInstance = config.productRepository();
      }
      return productRepositoryInstance;
    },

    get cartRepository() {
      if (!cartRepositoryInstance) {
        cartRepositoryInstance = config.cartRepository();
      }
      return cartRepositoryInstance;
    },

    get wishlistRepository() {
      if (!wishlistRepositoryInstance) {
        wishlistRepositoryInstance = config.wishlistRepository();
      }
      return wishlistRepositoryInstance;
    },

    get reviewRepository() {
      if (!reviewRepositoryInstance) {
        reviewRepositoryInstance = config.reviewRepository();
      }
      return reviewRepositoryInstance;
    },

    get addressRepository() {
      if (!addressRepositoryInstance) {
        addressRepositoryInstance = config.addressRepository();
      }
      return addressRepositoryInstance;
    },

    get orderRepository() {
      if (!orderRepositoryInstance) {
        orderRepositoryInstance = config.orderRepository();
      }
      return orderRepositoryInstance;
    },

    get userService() {
      if (!userServiceInstance) {
        userServiceInstance = config.userService({ userRepository: container.userRepository });
      }
      return userServiceInstance;
    },

    get productService() {
      if (!productServiceInstance) {
        productServiceInstance = config.productService({ productRepository: container.productRepository });
      }
      return productServiceInstance;
    },

    get cartService() {
      if (!cartServiceInstance) {
        cartServiceInstance = config.cartService({ cartRepository: container.cartRepository });
      }
      return cartServiceInstance;
    },

    get orderService() {
      if (!orderServiceInstance) {
        orderServiceInstance = config.orderService({
          orderRepository: container.orderRepository,
          cartRepository: container.cartRepository,
          addressRepository: container.addressRepository,
          productRepository: container.productRepository,
        });
      }
      return orderServiceInstance;
    },

    get reviewService() {
      if (!reviewServiceInstance) {
        reviewServiceInstance = config.reviewService({
          reviewRepository: container.reviewRepository,
          productRepository: container.productRepository,
        });
      }
      return reviewServiceInstance;
    },

    get addressService() {
      if (!addressServiceInstance) {
        addressServiceInstance = config.addressService({ addressRepository: container.addressRepository });
      }
      return addressServiceInstance;
    },

    get wishlistService() {
      if (!wishlistServiceInstance) {
        wishlistServiceInstance = config.wishlistService({
          wishlistRepository: container.wishlistRepository,
          productRepository: container.productRepository,
        });
      }
      return wishlistServiceInstance;
    },

    createRequestScope() {
      // For per-request scope, we create a new container with fresh instances
      // but sharing the same config (factories)
      return createContainer({
        userRepository: config.userRepository,
        productRepository: config.productRepository,
        cartRepository: config.cartRepository,
        wishlistRepository: config.wishlistRepository,
        reviewRepository: config.reviewRepository,
        addressRepository: config.addressRepository,
        orderRepository: config.orderRepository,
        userService: config.userService,
        productService: config.productService,
        cartService: config.cartService,
        orderService: config.orderService,
        reviewService: config.reviewService,
        addressService: config.addressService,
        wishlistService: config.wishlistService,
      });
    },
  };

  return container;
}

/**
 * Creates a test container with mock implementations
 * Useful for unit testing
 */
export function createTestContainer(overrides: Partial<ContainerConfig> = {}): DIContainer {
  // Default mock implementations
  const mockUserRepository: UserRepository = {
    findById: async () => null,
    findByIdWithStats: async () => null,
    updateProfile: async () => null,
  };

  const mockProductRepository: ProductRepository = {
    findMany: async () => ({ items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false } }),
    findFilterOptions: async () => ({ categories: [], materials: [], colors: [] }),
    findBySlug: async () => null,
    findSuggestions: async () => [],
  };

  const mockCartRepository: CartRepository = {
    findByUserId: async () => null,
    addItem: async () => null,
    updateQuantity: async () => null,
    removeItem: async () => {},
    clearCart: async () => {},
  };

  const mockWishlistRepository: WishlistRepository = {
    findAll: async () => [],
    findIds: async () => [],
    toggle: async () => ({ added: false, message: "" }),
    clear: async () => 0,
  };

  const mockReviewRepository: ReviewRepository = {
    findByProduct: async () => ({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } }),
    getSummary: async () => ({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }),
    findByUser: async () => ({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } }),
    create: async () => null,
    delete: async () => {},
  };

  const mockAddressRepository: AddressRepository = {
    findByUserId: async () => [],
    create: async () => null,
    update: async () => null,
    setDefault: async () => null,
    delete: async () => {},
  };

  const mockOrderRepository: OrderRepository = {
    findByUserId: async () => [],
    findById: async () => null,
    createFromCart: async () => null,
    updateStatus: async () => null,
    updatePaymentStatus: async () => null,
  };

  const mockUserService: UserService = {
    // Use type assertion to bypass private property check
    getProfile: async (userId: string) => mockUserRepository.findByIdWithStats(userId),
    updateProfile: async (userId: string, data: unknown) => mockUserRepository.updateProfile(userId, data as never),
  } as UserService;

  const mockProductService: ProductService = {
    getProducts: async () => ({ items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false } }),
    getFilterOptions: async () => ({ categories: [], materials: [], colors: [] }),
    getBySlug: async () => null,
    getSuggestions: async () => [],
  } as unknown as ProductService;

  const mockCartService: CartService = {
    getCart: async () => null,
    addItem: async () => null,
    updateQuantity: async () => null,
    removeItem: async () => {},
    clearCart: async () => {},
  } as unknown as CartService;

  const mockOrderService: OrderService = {
    listByUser: async () => [],
    getById: async () => null,
    createFromCart: async () => null,
    updateStatus: async () => null,
    updatePaymentStatus: async () => null,
  } as unknown as OrderService;

  const mockReviewService: ReviewService = {
    listByProduct: async () => ({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } }),
    getSummary: async () => ({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }),
    listByUser: async () => ({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } }),
    create: async () => null,
    delete: async () => {},
  } as unknown as ReviewService;

  const mockAddressService: AddressService = {
    list: async () => [],
    create: async () => null,
    update: async () => null,
    setDefault: async () => null,
    delete: async () => {},
  } as unknown as AddressService;

  const mockWishlistService: WishlistService = {
    getAll: async () => [],
    getIds: async () => [],
    toggle: async () => ({ added: false, message: "" }),
    clear: async () => 0,
  } as unknown as WishlistService;

  return createContainer({
    userRepository: () => mockUserRepository,
    productRepository: () => mockProductRepository,
    cartRepository: () => mockCartRepository,
    wishlistRepository: () => mockWishlistRepository,
    reviewRepository: () => mockReviewRepository,
    addressRepository: () => mockAddressRepository,
    orderRepository: () => mockOrderRepository,
    userService: () => mockUserService,
    productService: () => mockProductService,
    cartService: () => mockCartService,
    orderService: () => mockOrderService,
    reviewService: () => mockReviewService,
    addressService: () => mockAddressService,
    wishlistService: () => mockWishlistService,
    ...overrides,
  });
}