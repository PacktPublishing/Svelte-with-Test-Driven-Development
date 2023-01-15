import { describe, it, expect, vi } from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import BirthdayForm from './BirthdayForm.svelte';

describe('BirthdayForm', () => {
	it('displays a form', () => {
		render(BirthdayForm);
		expect(screen.queryByRole('form')).toBeVisible();
	});

	it('has a form method of POST', () => {
		render(BirthdayForm);
		expect(screen.getByRole('form').method).toEqual(
			'post'
		);
	});

	it('displays a button to save the form', () => {
		render(BirthdayForm);
		expect(
			screen.queryByRole('button')
		).toBeVisible();
	});

	it('sets the button type to submit', () => {
		render(BirthdayForm);
		expect(screen.getByRole('button').type).toEqual(
			'submit'
		);
	});

	describe('name field', () => {
		it('displays a text field for the contact name', () => {
			render(BirthdayForm);
			const field = screen.queryByLabelText('Name', {
				selector: 'input[type=text]'
			});
			expect(field).toBeVisible();
			expect(field.name).toEqual('name');
		});
	});

	describe('date of birth field', () => {
		it('displays a text field for the date of birth', () => {
			render(BirthdayForm);
			const field = screen.queryByLabelText(
				'Date of birth',
				{
					selector: 'input[type=text]'
				}
			);
			expect(field).toBeVisible();
			expect(field.name).toEqual('dob');
		});
	});

	describe('validation errors', () => {
		it('displays a message', () => {
			render(BirthdayForm, {
				form: { error: 'An error' }
			});
			expect(
				screen.queryByText('An error')
			).toBeVisible();
		});

		it('keeps the previous name value when an error occurs', () => {
			render(BirthdayForm, {
				form: {
					name: 'Hercules',
					error: 'Some awful error message'
				}
			});
			expect(
				screen.queryByLabelText('Name')
			).toHaveValue('Hercules');
		});

		it('keeps the previous dob value when an error occurs', () => {
			render(BirthdayForm, {
				form: {
					dob: '1994-01-01',
					error: 'Some awful error message'
				}
			});
			expect(
				screen.queryByLabelText('Date of birth')
			).toHaveValue('1994-01-01');
		});
	});
});
