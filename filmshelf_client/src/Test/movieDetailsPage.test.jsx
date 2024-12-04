import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MoviesPage from "../components/search/MoviesPage";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter for routing context

vi.mock("../../config/firebase-config", () => ({
  auth: {
    currentUser: { uid: "mockUserId" },
  },
}));

describe("MoviesPage", () => {
  beforeEach(() => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          results: [
            {
              id: 1,
              title: "Test Movie",
              poster_path: "/path/to/poster",
              genre_ids: [1],
            },
            {
              id: 2,
              title: "Another Movie",
              poster_path: "/path/to/another-poster",
              genre_ids: [2],
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          genres: [
            { id: 1, name: "Action" },
            { id: 2, name: "Comedy" },
            { id: 3, name: "Romance" },
          ],
        }),
      });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  //test 1
  test("handleResetFilters resets filters to default values", () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    const genreSelect = screen.getByTestId("genre-select");
    fireEvent.change(genreSelect, { target: { value: "Action" } });

    fireEvent.click(screen.getByText("Reset Filters"));

    expect(screen.getByTestId("genre-select").value).toBe("");
    expect(screen.getByText("<")).toBeInTheDocument();
  });

  //test 2
  test("renders movie posters correctly", async () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByAltText("Test Movie"));
    await waitFor(() => screen.getByAltText("Another Movie"));

    expect(screen.getByAltText("Test Movie")).toBeInTheDocument();
    expect(screen.getByAltText("Another Movie")).toBeInTheDocument();
  });

  //test 3
  test("filters movies by genre", async () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByAltText("Test Movie"));
    await waitFor(() => screen.getByAltText("Another Movie"));

    expect(screen.getByAltText("Test Movie")).toBeInTheDocument();
    expect(screen.getByAltText("Another Movie")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Comedy"));

    expect(screen.queryByAltText("Test Movie")).not.toBeInTheDocument();
    expect(screen.getByAltText("Another Movie")).toBeInTheDocument();
  });

  //test 4
  test("populates the genre dropdown correctly", async () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("genre-select"));

    const select = screen.getByTestId("genre-select");
    fireEvent.change(select, { target: { value: "3" } });

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Comedy")).toBeInTheDocument();
    expect(screen.getByText("Romance")).toBeInTheDocument();
  });

  //test 5
  test("displays loading spinner while fetching movie data", async () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => screen.getByAltText("Test Movie"));

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  //test 6
  test("displays a 'No Movies Found' message when there are no movies available", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ results: [] }),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          genres: [
            { id: 1, name: "Action" },
            { id: 2, name: "Comedy" },
            { id: 3, name: "Romance" },
          ],
        }),
      });

    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("No Movies Found"));

    expect(screen.getByText("No Movies Found")).toBeInTheDocument();
  });
});
