import { render, screen, fireEvent } from '@testing-library/react';
import InputArea from './InputArea';
import { vi, describe, it, expect } from 'vitest';

describe('InputArea Component', () => {
    const mockFilters = { startsWith: '', endsWith: '', contains: '' };
    const mockSetFilters = vi.fn();

    it('renders input field', () => {
        render(<InputArea letters="" loading={false} setLetters={() => { }} handleSolve={() => { }} filters={mockFilters} setFilters={mockSetFilters} />);
        expect(screen.getByPlaceholderText(/Enter letters/i)).toBeInTheDocument();
    });

    it('updates input value', () => {
        const setLetters = vi.fn();
        render(<InputArea letters="" loading={false} setLetters={setLetters} handleSolve={() => { }} filters={mockFilters} setFilters={mockSetFilters} />);
        const input = screen.getByPlaceholderText(/Enter letters/i);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(setLetters).toHaveBeenCalledWith('abc');
    });

    it('allows wildcard ? input', () => {
        const setLetters = vi.fn();
        render(<InputArea letters="" loading={false} setLetters={setLetters} handleSolve={() => { }} filters={mockFilters} setFilters={mockSetFilters} />);
        const input = screen.getByPlaceholderText(/Enter letters/i);
        fireEvent.change(input, { target: { value: 'a?b' } });
        expect(setLetters).toHaveBeenCalledWith('a?b');
    });

    it('submits form on button click', () => {
        const handleSolve = vi.fn((e) => e.preventDefault());
        render(<InputArea letters="abc" loading={false} setLetters={() => { }} handleSolve={handleSolve} filters={mockFilters} setFilters={mockSetFilters} />);
        const button = screen.getByRole('button', { name: "Solve" });
        fireEvent.click(button);
        expect(handleSolve).toHaveBeenCalled();
    });

    it('disables button when empty', () => {
        render(<InputArea letters="" loading={false} setLetters={() => { }} handleSolve={() => { }} filters={mockFilters} setFilters={mockSetFilters} />);
        expect(screen.getByRole('button', { name: "Solve" })).toBeDisabled();
    });

    it('disables button when loading', () => {
        render(<InputArea letters="abc" loading={true} setLetters={() => { }} handleSolve={() => { }} filters={mockFilters} setFilters={mockSetFilters} />);
        expect(screen.getByRole('button', { name: "Solve" })).toBeDisabled();
    });
});
