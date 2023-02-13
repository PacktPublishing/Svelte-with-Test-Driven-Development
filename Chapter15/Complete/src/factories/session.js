import { vi } from 'vitest';

const validSession = { user: 'api ' };

export const loggedInSession = () => ({
	session: validSession
});

export const loggedOutSession = () => ({
	session: null
});

export const loggedInLocalsSession = () => ({
	getSession: vi.fn().mockResolvedValue(validSession)
});

export const loggedOutLocalsSession = () => ({
	getSession: vi.fn().mockResolvedValue(null)
});
