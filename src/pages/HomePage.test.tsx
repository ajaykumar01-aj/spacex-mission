import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { FavoritesProvider } from "../context/FavoritesContext";

const mockLaunches = [
  {
    id: "1",
    name: "Mission Alpha",
    date_utc: "2020-01-01T00:00:00Z",
    success: true,
    rocket: "rocket1",
    rocketName: "Falcon 9",
    links: { patch: { small: null }, webcast: null, wikipedia: null },
    details: "Details of Mission Alpha",
  },
  {
    id: "2",
    name: "Mission Beta",
    date_utc: "2021-01-01T00:00:00Z",
    success: false,
    rocket: "rocket2",
    rocketName: "Falcon Heavy",
    links: { patch: { small: null }, webcast: null, wikipedia: null },
    details: "Details of Mission Beta",
  },
];

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockLaunches),
    } as Response)
  ) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

const renderWithProviders = () =>
  render(
    <FavoritesProvider>
      <HomePage />
    </FavoritesProvider>
  );

test("renders and filters launches", async () => {
  renderWithProviders();
  expect(screen.getByText(/Loading launches/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Mission Alpha")).toBeInTheDocument();
    expect(screen.getByText("Mission Beta")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText(/Show only successful launches/i));

  expect(screen.getByText("Mission Alpha")).toBeInTheDocument();
  expect(screen.queryByText("Mission Beta")).not.toBeInTheDocument();
});

test("adds and removes favorite", async () => {
  renderWithProviders();

  await waitFor(() => screen.getByText("Mission Alpha"));

  // Initially Mission Alpha is not favorite (gray star)
  const favoriteButtons = screen.getAllByRole("button", {
    name: /Add to favorites|Remove favorite/i,
  });

  // Toggle favorite for Mission Alpha
  fireEvent.click(favoriteButtons[0]);
  expect(favoriteButtons[0]).toHaveAccessibleName("Remove favorite");

  // Toggle un-favorite for Mission Alpha
  fireEvent.click(favoriteButtons[0]);
  expect(favoriteButtons[0]).toHaveAccessibleName("Add to favorites");
});

test("shows and closes modal", async () => {
  renderWithProviders();

  await waitFor(() => screen.getByText("Mission Alpha"));

  fireEvent.click(screen.getByText("Mission Alpha"));

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("Details of Mission Alpha")).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Close details modal"));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
