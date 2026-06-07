import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar";

function renderSearchBar() {
  return render(
    <MemoryRouter>
      <SearchBar />
    </MemoryRouter>
  );
}

describe("SearchBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("waits 300 ms before requesting search results", async () => {
    global.fetch.mockResolvedValue({ json: async () => [] });
    renderSearchBar();

    fireEvent.change(screen.getByPlaceholderText("Search by title or author..."), {
      target: { value: "Atomic" },
    });

    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=Atomic"
    );
  });

  test("renders API results as links to their book pages", async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        {
          id: "42",
          title: "Atomic Habits",
          author: "James Clear",
          imageLink: "https://example.com/atomic-habits.jpg",
        },
      ],
    });
    renderSearchBar();

    fireEvent.change(screen.getByPlaceholderText("Search by title or author..."), {
      target: { value: "Atomic" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Atomic Habits/i })).toHaveAttribute(
      "href",
      "/book/42"
    );
  });

  test("does not search when the query is cleared", async () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText("Search by title or author...");

    fireEvent.change(input, { target: { value: "Deep Work" } });
    fireEvent.change(input, { target: { value: "" } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
