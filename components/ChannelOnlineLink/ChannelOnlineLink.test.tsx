import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChannelOnlineLink from './ChannelOnlineLink';
import test, { describe } from 'node:test';

describe('<ChannelOnlineLink />', () => {
  test('it should mount', () => {
    render(<ChannelOnlineLink href="#">ChannelOnlineLink</ChannelOnlineLink>);

    const channelOnlineLink = screen.getByTestId('ChannelOnlineLink');

    expect(channelOnlineLink).toBeInTheDocument();
  });
});
