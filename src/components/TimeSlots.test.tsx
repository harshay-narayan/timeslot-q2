import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TimeSlots from "./TimeSlots";
import type { TimeSlot } from "./types";

// Updated mock data
const mockSlots: TimeSlot[] = [
  {
    displayDate: "2024/08/02",
    displayTime: "07:30AM",
    displayTimeEnd: "08:00AM",
    startTimeUtc: 1722564000,
    endTimeUtc: 1722565800,
  },
  {
    displayDate: "2024/08/02",
    displayTime: "08:00AM",
    displayTimeEnd: "08:30AM",
    startTimeUtc: 1722565800,
    endTimeUtc: 1722567600,
  },
  {
    displayDate: "2024/08/05",
    displayTime: "10:00AM",
    displayTimeEnd: "10:30AM",
    startTimeUtc: 1722832200,
    endTimeUtc: 1722834000,
  },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

describe("TimeSlots Component", () => {
  it("renders dates and slots after successful fetch", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => mockSlots,
    });

    render(<TimeSlots />);

    // Wait for a date button to appear (from 2024/08/02)
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // Select the first date
    fireEvent.click(screen.getByText("2"));

    // Time slots for that date should appear
    await waitFor(() => {
      expect(screen.getByText("07:30AM")).toBeInTheDocument();
      expect(screen.getByText("08:00AM")).toBeInTheDocument();
    });
  });

  it("displays error message when fetch fails", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Fetch error"));

    render(<TimeSlots />);

    await waitFor(() =>
      expect(screen.getByText(/error in loading slots/i)).toBeInTheDocument()
    );
  });

  it("selects a date and displays related time slots", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => mockSlots,
    });

    render(<TimeSlots />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText("07:30AM")).toBeInTheDocument();
    expect(screen.getByText("08:00AM")).toBeInTheDocument();
  });

  it("toggles selected time slot and enables/disables Book button", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => mockSlots,
    });

    render(<TimeSlots />);

    await waitFor(() => screen.getByText("2"));
    fireEvent.click(screen.getByText("2"));

    const timeButton = screen.getByText("07:30AM");
    fireEvent.click(timeButton);

    const bookBtn = screen.getByRole("button", { name: /book/i });
    expect(bookBtn).not.toBeDisabled();

    // Deselect time slot
    fireEvent.click(timeButton);
    expect(bookBtn).toBeDisabled();
  });

  it("resets state after booking", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => mockSlots,
    });

    render(<TimeSlots />);

    await waitFor(() => screen.getByText("5")); // from 2024/08/05
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("10:00AM"));

    const bookBtn = screen.getByRole("button", { name: /book/i });
    fireEvent.click(bookBtn);

    expect(bookBtn).toBeDisabled();
    expect(
      screen.getByText(/Please select a date to see available time slots/i)
    ).toBeInTheDocument();
  });
});
