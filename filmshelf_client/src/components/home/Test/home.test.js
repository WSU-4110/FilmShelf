import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/home/home';

// Mock the global `fetch` API
global.fetch = vi.fn();

describe('Home Page Tests', () => {
  beforeEach(() => {
    // Mock API responses
    fetch.mockImplementation((url) =>
      Promise.resolve({
        json: () =>
          Promise.resolve(
            url.includes('/genre/movie/list')
              ? { genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }] }
              : url.includes('/movie/popular')
              ? {
                  results: [
                    { title: 'Film 1', poster_path: '/path1.jpg', genre_ids: [1] },
                    { title: 'Film 2', poster_path: '/path2.jpg', genre_ids: [2] },
                  ],
                }
              : url.includes('/movie/upcoming')
              ? {
                  results: [
                    { title: 'Upcoming 1', poster_path: '/path3.jpg', overview: 'Overview 1' },
                  ],
                }
              : {}
          ),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks(); // Reset mocks after each test
  });

  // Test 1: Header rendering
  it('renders the header with the correct title', () => {
    render(<Home />);
    const headerElement = screen.getByText(/Most Popular Movies/i);
    expect(headerElement).toBeInTheDocument();
  });

  // Test 2: Popular movies carousel
  it('renders the popular movies carousel with correct slides', async () => {
    render(<Home />);
    const slides = await screen.findAllByRole('img', { name: /Film/i });
    expect(slides).toHaveLength(2);
  });

  // Test 3: Genre badges
  it('renders genre badges correctly', async () => {
    render(<Home />);
    const badges = await screen.findAllByText(/Action|Comedy/);
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent('Action');
    expect(badges[1]).toHaveTextContent('Comedy');
  });

  // Test 4: Modal behavior
  it('opens a modal when clicking an upcoming movie card', async () => {
    render(<Home />);
    const movieCard = await screen.findByText('Upcoming 1');
    fireEvent.click(movieCard);
    const modal = screen.getByText(/Overview 1/);
    expect(modal).toBeInTheDocument();
  });

  // Test 5: Swiper navigation
  it('navigates through the carousel using navigation buttons', async () => {
    render(<Home />);
    const nextButton = screen.getByText('>');
    const prevButton = screen.getByText('<');

    await userEvent.click(nextButton);
    expect(screen.getByText('Film 2')).toBeInTheDocument();

    await userEvent.click(prevButton);
    expect(screen.getByText('Film 1')).toBeInTheDocument();
  });

  // Test 6: Renders upcoming movie release date
  it('displays the release date of upcoming movies correctly', async () => {
    render(<Home />);
    const releaseDate = await screen.findByText(/Release Date/i);
    expect(releaseDate).toBeInTheDocument();
    expect(releaseDate).toHaveTextContent('Release Date:');
  });
});
