import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

import VariantSelector from "@/components/features/product-detail/VariantSelector";

const mockColors = [
  { name: "Red", value: "#FF0000", inStock: true },
  { name: "Blue", value: "#0000FF", inStock: true },
  { name: "Green", value: "#00FF00", inStock: false },
];

const mockSizes = [
  { name: "S", value: "S", inStock: true },
  { name: "M", value: "M", inStock: true },
  { name: "L", value: "L", inStock: false },
  { name: "XL", value: "XL", inStock: true },
];

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

describe("VariantSelector", () => {
  it("renders color options", () => {
    render(
      <VariantSelector
        colors={mockColors}
        selectedColor="#FF0000"
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Red" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Blue" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Green" })).toBeInTheDocument();
  });

  it("renders size options", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        selectedSize="M"
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Size S" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Size M" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Size L" })).toBeInTheDocument();
  });

  it("calls onColorChange when color is selected", () => {
    const handleColorChange = vi.fn();
    render(
      <VariantSelector
        colors={mockColors}
        selectedColor=""
        onColorChange={handleColorChange}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const blueRadio = screen.getByRole("radio", { name: "Blue" });
    fireEvent.click(blueRadio);

    expect(handleColorChange).toHaveBeenCalledWith("#0000FF");
  });

  it("calls onSizeChange when size is selected", () => {
    const handleSizeChange = vi.fn();
    render(
      <VariantSelector
        sizes={mockSizes}
        selectedSize=""
        onColorChange={vi.fn()}
        onSizeChange={handleSizeChange}
      />,
      { wrapper: createWrapper() }
    );

    const xlRadio = screen.getByRole("radio", { name: "Size XL" });
    fireEvent.click(xlRadio);

    expect(handleSizeChange).toHaveBeenCalledWith("XL");
  });

  it("does not call onColorChange for out of stock colors", () => {
    const handleColorChange = vi.fn();
    render(
      <VariantSelector
        colors={mockColors}
        selectedColor=""
        onColorChange={handleColorChange}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const greenRadio = screen.getByRole("radio", { name: "Green" });
    fireEvent.click(greenRadio);

    expect(handleColorChange).not.toHaveBeenCalled();
  });

  it("does not call onSizeChange for out of stock sizes", () => {
    const handleSizeChange = vi.fn();
    render(
      <VariantSelector
        sizes={mockSizes}
        selectedSize=""
        onColorChange={vi.fn()}
        onSizeChange={handleSizeChange}
      />,
      { wrapper: createWrapper() }
    );

    const largeRadio = screen.getByRole("radio", { name: "Size L" });
    fireEvent.click(largeRadio);

    expect(handleSizeChange).not.toHaveBeenCalled();
  });

  it("shows selected state for colors", () => {
    render(
      <VariantSelector
        colors={mockColors}
        selectedColor="#FF0000"
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const redRadio = screen.getByRole("radio", { name: "Red" });
    expect(redRadio).toBeChecked();
  });

  it("shows selected state for sizes", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        selectedSize="M"
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const mediumRadio = screen.getByRole("radio", { name: "Size M" });
    expect(mediumRadio).toBeChecked();
  });

  it("shows expand button when more than 6 colors", () => {
    const manyColors = Array.from({ length: 8 }, (_, i) => ({
      name: `Color ${i}`,
      value: `#${i.toString(16).repeat(6)}`,
      inStock: true,
    }));

    render(
      <VariantSelector
        colors={manyColors}
        selectedColor=""
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByRole("button", { name: /\+2/ })).toBeInTheDocument();
  });

  it("shows expand button when more than 8 sizes", () => {
    const manySizes = Array.from({ length: 10 }, (_, i) => ({
      name: `Size ${i}`,
      value: `${i}`,
      inStock: true,
    }));

    render(
      <VariantSelector
        sizes={manySizes}
        selectedSize=""
        onColorChange={vi.fn()}
        onSizeChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByRole("button", { name: /\+2/ })).toBeInTheDocument();
  });
});