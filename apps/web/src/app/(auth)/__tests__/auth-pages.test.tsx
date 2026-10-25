import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

// Mock environment
vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

const mockSessionData = {
  user: null,
  session: null,
};

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
      social: vi.fn(),
    },
    forgetPassword: vi.fn(),
    resetPassword: vi.fn(),
    useSession: () => ({
      data: mockSessionData,
    }),
  },
}));

import LoginPage from "@/app/(auth)/log-in/page";
import SignUpPage from "@/app/(auth)/sign-up/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";

const server = setupServer(
  http.post("http://localhost:3000/api/auth/sign-in/email", async () => {
    return HttpResponse.json({
      success: true,
      data: { user: { id: "user-1", email: "test@example.com" }, token: "test-token" },
    });
  }),
  http.post("http://localhost:3000/api/auth/sign-up/email", async () => {
    return HttpResponse.json({
      success: true,
      data: { user: { id: "user-1", email: "test@example.com" }, token: "test-token" },
    });
  }),
  http.post("http://localhost:3000/api/auth/forget-password", async () => {
    return HttpResponse.json({ success: true });
  }),
  http.post("http://localhost:3000/api/auth/reset-password", async () => {
    return HttpResponse.json({ success: true });
  })
);

// Simple wrapper without additional providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </QueryClientProvider>
  );
};

describe("Auth Pages - Form Validation", () => {
  beforeEach(() => {
    server.listen();
    vi.clearAllMocks();
    Object.assign(mockSessionData, {
      user: null,
      session: null,
    });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  describe("LoginPage", () => {
    it("renders login form with email and password fields", () => {
      render(<LoginPage />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<LoginPage />, { wrapper: createWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it("shows validation error for short password", async () => {
      const user = userEvent.setup();
      render(<LoginPage />, { wrapper: createWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "short");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it("shows remember me checkbox", () => {
      render(<LoginPage />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it("shows forgot password link", () => {
      render(<LoginPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("link", { name: /forgot password/i })).toBeInTheDocument();
    });

    it("shows social login buttons", () => {
      render(<LoginPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
    });

    it("shows sign up link", () => {
      render(<LoginPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe("SignUpPage", () => {
    it("renders signup form with all fields", () => {
      render(<SignUpPage />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/create a password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    it("shows validation error for short first name", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />, { wrapper: createWrapper() });

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/create a password/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(firstNameInput, "J");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it("shows social login buttons", () => {
      render(<SignUpPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
    });

    it("shows login link", () => {
      render(<SignUpPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    });
  });

  describe("ForgotPasswordPage", () => {
    it("renders forgot password form", () => {
      render(<ForgotPasswordPage />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    });

    it("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />, { wrapper: createWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it("shows login link", () => {
      render(<ForgotPasswordPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe("ResetPasswordPage", () => {
    it("renders reset password form", () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
    });

    it("shows validation error for short password", async () => {
      const user = userEvent.setup();
      render(<ResetPasswordPage />, { wrapper: createWrapper() });

      const passwordInput = screen.getByLabelText(/new password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      await user.type(passwordInput, "short");
      await user.type(confirmPasswordInput, "short");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it("shows login link", () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    });
  });
});