import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { reducer } from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import { ThemeProvider } from '../contexts/ThemeContext/ThemeContext';
import thunk from 'redux-thunk';
import Navigation from '../components/Navigation/Navigation';

// unit test - verify login/register button on top-right if unauthenticated
test('if not logged in, login/regster button is shown on the top right', () => {
  render(
    <Provider store={createStore(reducer, compose(applyMiddleware(thunk)))}>
      <ThemeProvider>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>,
  );

  expect(screen.getAllByRole('link', { name: /login \/ register/i })).not.toBeNull();
});
