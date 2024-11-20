import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../home'; // Update the path if necessary

// Mock Data
const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
];
const mockPopularMovies = [
  { title: 'Film 1', poster_path: '/path1.jpg', genre_ids: [1] },
  { title: 'Film 2', poster_path: '/path2.jpg', genre_ids: [2] },
];
const mockUpcomingMovies = [
  { title: 'Upcoming 1', poster_path: '/path3.jpg', overview: 'Overview 1', release_date: '2024-11-19' },
];

// Mock Fetch API
vi.mock('global', () => ({
  fetch: vi.fn((url) =>
    Promise.resolve({
      json: () =>
        Promise.resolve(
          url.includes('/genre/movie/list')
            ? { genres: mockGenres }
            : url.includes('/movie/popular')
            ? { results: mockPopularMovies }
            : url.includes('/movie/upcoming')
            ? { results: mockUpcomingMovies }
            : {}
        ),
    })
  ),
}));

// Mock NavBar
vi.mock('../../nav/nav', () => ({
  NavBar: () => <nav data-testid="navbar">NavBar</nav>,
}));

// Reset Mock Data
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Home Component', () => {
  it('renders NavBar and header', () => {
    render(<Home />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Most Popular Movies')).toBeInTheDocument();
  });

  it('renders the popular movies carousel with correct slides', async () => {
    render(<Home />);
    const slides = await screen.findAllByRole('img', { name: /Film/i });
    expect(slides).toHaveLength(mockPopularMovies.length);
  });

  it('opens the modal when an upcoming movie card is clicked', async () => {
    render(<Home />);
    const movieCard = await screen.findByText('Upcoming 1');
    fireEvent.click(movieCard);
    expect(screen.getByText('Overview 1')).toBeInTheDocument();
  });

  it('closes the modal when close button is clicked', async () => {
    render(<Home />);
    const movieCard = await screen.findByText('Upcoming 1');
    fireEvent.click(movieCard);
    expect(screen.getByText('Overview 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('×')); // Close button
    expect(screen.queryByText('Overview 1')).not.toBeInTheDocument();
  });

  it('renders genre badges for popular movies', async () => {
    render(<Home />);
    const badges = await screen.findAllByText(/Action|Comedy/);
    expect(badges).toHaveLength(mockGenres.length);
    expect(badges[0]).toHaveTextContent('Action');
    expect(badges[1]).toHaveTextContent('Comedy');
  });

  it('displays release dates for upcoming movies', async () => {
    render(<Home />);
    const releaseDate = await screen.findByText(/Release Date/i);
    expect(releaseDate).toBeInTheDocument();
    expect(releaseDate).toHaveTextContent('Release Date: Tue Nov 19 2024');
  });
});
