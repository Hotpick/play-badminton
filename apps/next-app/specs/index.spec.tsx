import React, { Suspense } from 'react';
import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../messages/en.json';
import Page from '../src/app/[locale]/page';

jest.mock('next-intl/server', () => ({ setRequestLocale: jest.fn() }));

describe('Page', () => {
  it('should render translated content', async () => {
    await act(async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <Suspense>
            <Page params={Promise.resolve({ locale: 'en' })} />
          </Suspense>
        </NextIntlClientProvider>,
      );
    });
    expect(screen.getByText(messages.HomePage.welcome)).toBeTruthy();
  });
});
