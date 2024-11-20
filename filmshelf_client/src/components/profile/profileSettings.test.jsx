import {describe, expect, test, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProfileSettings from './profileSettings.jsx';

const mockUser = { displayName: 'Test User', email: 'test@example.com' };

vi.mock('../../nav/nav', () => ({
    NavBar: () => <nav data-testid="navbar">NavBar</nav>,
  }));

describe('Profile settings component', () => {
    it('renders profile settings page', () => {
        render(<BrowserRouter><ProfileSettings /></BrowserRouter>);

        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });

    it('checks to make sure 3 buttons are there', () => {
        render(<BrowserRouter><ProfileSettings /></BrowserRouter>);

        expect(screen.getByText('Change Account')).toBeInTheDocument();
        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByText('Change Profile Image')).toBeInTheDocument();
    });

    it('makes sure pressing Change Profile Image button prompts user to select a file', () => {
        render(<ProfileSettings />);

        const fileInput = screen.getByLabelText(/Change Profile Image/i);

        const chngImg = vi.fn();
        fileInput.addEventListener('click', chngImg);
        fireEvent.click(fileInput);

        expect(handleClick).toHaveBeenCalled();
    });
});