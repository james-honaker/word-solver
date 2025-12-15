import { render, screen, fireEvent } from '@testing-library/react';
import InputArea from './InputArea';
import { vi, describe, it, expect } from 'vitest';

describe('InputArea Component', () => {
    it('renders input field', () => {
        render(<InputArea letters="" loading={false} setLetters={() => { }} handleSolve={() => { }} />);
        expect(screen.getByPlaceholderText(/Enter letters/i)).toBeInTheDocument();
    });

    it('updates input value', () => {
        const setLetters = vi.fn();
        render(<InputArea letters="" loading={false} setLetters={setLetters} handleSolve={() => { }} />);
        const input = screen.getByPlaceholderText(/Enter letters/i);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(setLetters).toHaveBeenCalledWith('abc');
    });

    it('allows wildcard ? input', () => {
        const setLetters = vi.fn();
        render(<InputArea letters="" loading={false} setLetters={setLetters} handleSolve={() => { }} />);
        const input = screen.getByPlaceholderText(/Enter letters/i);
        fireEvent.change(input, { target: { value: 'a?b' } });
        expect(setLetters).toHaveBeenCalledWith('a?b');
    });

    it('submits form on button click', () => {
        const handleSolve = vi.fn((e) => e.preventDefault());
        render(<InputArea letters="abc" loading={false} setLetters={() => { }} handleSolve={handleSolve} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(handleSolve).toHaveBeenCalled();
    });

    it('disables button when empty', () => {
        render(<InputArea letters="" loading={false} setLetters={() => { }} handleSolve={() => { }} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when loading', () => {
        render(<InputArea letters="abc" loading={true} setLetters={() => { }} handleSolve={() => { }} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
