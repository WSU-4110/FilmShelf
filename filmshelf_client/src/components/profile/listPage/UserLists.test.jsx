import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserLists from './listPage';

// Mock data for user lists
const mockUserLists = {
    MyList: {
      name: 'MyList',
      description: 'Test list',
      movies: [{ id: '123', title: 'Sample Movie' }],
    },
  };

// Mock Firebase
vi.mock('../../../config/firebase-config', () => ({
  auth: { currentUser: { uid: 'test-uid' } },
  db: {},
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({
        lists: mockUserLists,
      }),
    }),
    updateDoc: vi.fn((_, updatedData) => {
      Object.assign(mockUserLists, updatedData.lists);
    }),
  }));
  

// Mock NavBar
vi.mock('../../nav/nav', () => ({
  NavBar: () => <nav data-testid="navbar">NavBar</nav>,
}));


// Reset mockUserLists before each test
beforeEach(() => {
    vi.clearAllMocks(); // Reset all mocks
    Object.keys(mockUserLists).forEach((key) => delete mockUserLists[key]);
    mockUserLists.MyList = {
      name: 'MyList',
      description: 'Test list',
      movies: [{ id: '123', title: 'Sample Movie' }],
    };
  });
  
  
  

// Test Suite
describe('UserLists Component', () => {
  it('renders NavBar and Add List button', () => {
    render(<UserLists />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Add List')).toBeInTheDocument();
  });

  it('opens the modal when Add List button is clicked', () => {
    render(<UserLists />);
    const addButton = screen.getByText('Add List');
    fireEvent.click(addButton);
    expect(screen.getByText('Create New List')).toBeInTheDocument();
  });

  it('closes the modal when close button is clicked', async () => {
    render(<UserLists />);
    const addButton = screen.getByText('Add List');
    fireEvent.click(addButton);
    expect(screen.getByText('Create New List')).toBeInTheDocument();
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('Create New List')).not.toBeInTheDocument();
  });

  it('displays existing lists fetched from Firebase', async () => {
    render(<UserLists />);
    const listTitle = await screen.findByText('MyList');
    expect(listTitle).toBeInTheDocument();
    const listDescription = screen.getByText('Test list');
    expect(listDescription).toBeInTheDocument();
  });
  

  it('calls saveList on Save List button click', async () => {
    render(<UserLists />);
    fireEvent.click(screen.getByText('Add List'));
    const listNameInput = screen.getByPlaceholderText('List Name');
    fireEvent.change(listNameInput, { target: { value: 'My New List' } });
    const saveButton = screen.getByText('Save List');
    fireEvent.click(saveButton);
    const newList = await screen.findByText((content, element) => {
      return element.tagName.toLowerCase() === 'h3' && content === 'My New List';
    });
    expect(newList).toBeInTheDocument();
  });
  

  it('edits the description of a list', async () => {
    render(<UserLists />);
    const editButton = await screen.findByText('Edit List');
    fireEvent.click(editButton);
    const descriptionInput = await screen.findByPlaceholderText(/optional description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
    const saveButton = screen.getByText('Save List');
    fireEvent.click(saveButton);
    await screen.findByText('Updated description');
    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });
  
});
