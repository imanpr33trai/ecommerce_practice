import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { AuthForm } from "@/components/auth/AuthForm";
import { z } from "zod";

describe("AuthLayout", () => {
  it("renders children and title", () => {
    render(
      <AuthLayout title="Test Title" description="Test Description">
        <div data-testid="child">Child Content</div>
      </AuthLayout>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <AuthLayout 
        title="Test Title" 
        description="Test Description"
        footer={<span data-testid="footer">Footer Content</span>}
      >
        <div>Child</div>
      </AuthLayout>
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders logo link", () => {
    render(
      <AuthLayout title="Test Title" description="Test Description">
        <div>Child</div>
      </AuthLayout>
    );

    expect(screen.getByRole("link", { name: /nestify/i })).toBeInTheDocument();
  });
});

describe("SocialLoginButtons", () => {
  it("renders email and github buttons", () => {
    render(<SocialLoginButtons />);

    expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
  });

  it("calls onGoogleClick when email button clicked", () => {
    const onGoogleClick = vi.fn();
    render(<SocialLoginButtons onGoogleClick={onGoogleClick} />);

    fireEvent.click(screen.getByRole("button", { name: /email/i }));
    expect(onGoogleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onGithubClick when github button clicked", () => {
    const onGithubClick = vi.fn();
    render(<SocialLoginButtons onGithubClick={onGithubClick} />);

    fireEvent.click(screen.getByRole("button", { name: /github/i }));
    expect(onGithubClick).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when disabled prop is true", () => {
    render(<SocialLoginButtons disabled={true} />);

    expect(screen.getByRole("button", { name: /email/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /github/i })).toBeDisabled();
  });
});

describe("AuthForm", () => {
  const TestSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password too short"),
  });

  type TestFormData = z.infer<typeof TestSchema>;

  it("renders form with submit button", () => {
    render(
      <AuthForm<typeof TestSchema>
        schema={TestSchema}
        onSubmit={vi.fn()}
        submitText="Submit"
      >
        {({ register }) => (
          <input {...register("email")} data-testid="email" />
        )}
      </AuthForm>
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(
      <AuthForm<typeof TestSchema>
        schema={TestSchema}
        onSubmit={vi.fn()}
        submitText="Submit"
        isLoading={true}
      >
        {({ register }) => (
          <input {...register("email")} data-testid="email" />
        )}
      </AuthForm>
    );

    expect(screen.getByRole("button", { name: /loading/i })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onSubmit with valid data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(
      <AuthForm<typeof TestSchema>
        schema={TestSchema}
        onSubmit={onSubmit}
        submitText="Submit"
      >
        {({ register }) => (
          <>
            <input {...register("email")} data-testid="email" />
            <input {...register("password")} type="password" data-testid="password" />
          </>
        )}
      </AuthForm>
    );

    fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("does not call onSubmit with invalid data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(
      <AuthForm<typeof TestSchema>
        schema={TestSchema}
        onSubmit={onSubmit}
        submitText="Submit"
      >
        {({ register }) => (
          <>
            <input {...register("email")} data-testid="email" />
            <input {...register("password")} type="password" data-testid="password" />
          </>
        )}
      </AuthForm>
    );

    fireEvent.change(screen.getByTestId("email"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByTestId("password"), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await vi.waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
    // Validation errors are shown via FormMessage component which requires FormField context
    // The form correctly prevents submission when validation fails
  });

  it("uses defaultValues when provided", () => {
    render(
      <AuthForm<typeof TestSchema>
        schema={TestSchema}
        onSubmit={vi.fn()}
        submitText="Submit"
        defaultValues={{ email: "default@example.com", password: "defaultpass" }}
      >
        {({ watch }) => (
          <>
            <span data-testid="email-value">{watch("email")}</span>
            <span data-testid="password-value">{watch("password")}</span>
          </>
        )}
      </AuthForm>
    );

    expect(screen.getByTestId("email-value")).toHaveTextContent("default@example.com");
    expect(screen.getByTestId("password-value")).toHaveTextContent("defaultpass");
  });
});