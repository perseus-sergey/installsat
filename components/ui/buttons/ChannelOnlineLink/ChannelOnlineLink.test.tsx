import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChannelOnlineLink from './ChannelOnlineLink';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<ChannelOnlineLink />', () => {
  test('it should mount', () => {
    render(
      <ChannelOnlineLink
        lang={ELanguage.EN}
        href="#"
        channelName={'channelName'}
      />
    );

    const channelOnlineLink = screen.getByTestId('ChannelOnlineLink');

    expect(channelOnlineLink).toBeInTheDocument();
  });
});
