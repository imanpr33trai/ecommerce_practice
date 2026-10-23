import type { UserRepository } from "../repositories/user.repository.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { CartRepository } from "../repositories/cart.repository.js";
import type { WishlistRepository } from "../repositories/wishlist.repository.js";
import type { ReviewRepository } from "../repositories/review.repository.js";
import type { AddressRepository } from "../repositories/address.repository.js";
import type { OrderRepository } from "../repositories/order.repository.js";

import type { UserService } from "../services/UserService.js";

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

  return createContainer({
    userRepository: () => mockUserRepository,
    productRepository: () => mockProductRepository,
    cartRepository: () => mockCartRepository,
    wishlistRepository: () => mockWishlistRepository,
    reviewRepository: () => mockReviewRepository,
    addressRepository: () => mockAddressRepository,
    orderRepository: () => mockOrderRepository,
    userService: () => mockUserService,
    ...overrides,
  });
}