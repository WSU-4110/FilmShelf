import {describe, expect, test, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import ProfilePage from './profilePage.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProfileSettings from './profileSettings.jsx';

const mockUser = { displayName: 'Test User', email: 'test@example.com' };

vi.mock('../../nav/nav', () => ({
    NavBar: () => <nav data-testid="navbar">NavBar</nav>,
  }));



describe('Profile Page component', () => {
    it('renders profile page', () => {
        render(<BrowserRouter><ProfilePage /></BrowserRouter>);
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();

    });

    it('checks for profile settings button rendering', () => {
        render(<BrowserRouter><ProfilePage /></BrowserRouter>);

        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });

    it('checks for profile settings button functionality', () => {
        render(<BrowserRouter><ProfilePage /></BrowserRouter>);

        const addButton = screen.getByText('ProfileSettings');
        fireEvent.click(addButton);

        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });

});
