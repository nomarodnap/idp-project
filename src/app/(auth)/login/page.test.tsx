import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Sarabun: () => ({ variable: "--font-sans" }),
}));

vi.mock("@/app/globals.css", () => ({}));

vi.mock("@/components/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => null,
}));

vi.mock("@/components/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Toggle theme</button>,
}));

import { metadata as rootMetadata } from "@/app/layout";
import LoginPage from "./page";

describe("LoginPage Safari hydration safety", () => {
  it("disables browser format auto-detection in root metadata", () => {
    expect(rootMetadata.formatDetection).toEqual({
      telephone: false,
      date: false,
      email: false,
      address: false,
    });
  });

  it("renders contact phone numbers as explicit tel links so Safari does not inject <a> tags", () => {
    render(<LoginPage />);

    const gbkPhoneLink = screen.getByRole("link", { name: "025620600" });
    expect(gbkPhoneLink).toHaveAttribute("href", "tel:025620600");

    const itPhoneLink = screen.getByRole("link", { name: "025795591" });
    expect(itPhoneLink).toHaveAttribute("href", "tel:025795591");
  });
});
