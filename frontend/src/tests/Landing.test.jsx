import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../components/Home/Landing/Landing';

// unit test - verify no welcome message if unauthenticated
test('if not logged in, there is no welcome username message', () => {
  render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>,
  );

  expect(screen.getByRole('heading', { name: /realtime stock simulator/i })).toHaveTextContent('Realtime Stock Simulator');
});
