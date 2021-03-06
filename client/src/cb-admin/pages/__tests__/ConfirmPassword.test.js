import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';

import renderWithRouter from '../../../tests';
import ConfirmPassword from '../ConfirmPassword';

describe('ConfirmPassword Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: incorrect password responds 401 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/api/admin/login')
      .reply(401, { result: null, error: 'Incorrect password' }, { authorization: 'authstring' });

    const { getByText, getByLabelText } =
        renderWithRouter({ updateAdminToken: () => { } })(ConfirmPassword);
    const password = getByLabelText('Password');
    const submit = getByText('CONTINUE');
    password.value = 'lolLOL123';
    fireEvent.change(password);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('Wrong password'));
    expect(error.textContent).toEqual('Wrong password');
  });

  test(':: incorrect password responds 401 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/api/admin/login')
      .reply(200, { result: { token: 'authstring' } });

    const { getByText, getByLabelText, history } =
        renderWithRouter({ updateAdminToken: () => { } })(ConfirmPassword);
    const password = getByLabelText('Password');
    const submit = getByText('CONTINUE');
    password.value = 'Funnyfingers11!';
    fireEvent.change(password);
    fireEvent.click(submit);

    await wait(() => history.length === 2);
    expect(history.location.pathname).toEqual('/admin');
  });

});
