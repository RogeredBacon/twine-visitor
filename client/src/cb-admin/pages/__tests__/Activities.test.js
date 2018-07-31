import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';

import renderWithRouter from '../../../tests/helpers';
import Activities from '../Activities';

const { refresh: refreshDB } = require('../../../../../db/scripts');

const yakbak = require('yakbak');
const http = require('http');

const proxy = http.createServer(yakbak('http://localhost:4000', {
  dirname: `${__dirname}/../../../tests/tapes`,
}));

const token = process.env.TEST_ADMIN_TOKEN;
require('dotenv').config();

describe('Activities Component', () => {

  beforeAll(async () => {
    proxy.listen(4567);
    // await refreshDB();
  });

  afterEach(cleanup);

  // test('page load :: correct response renders rows for each activity', async () => {

  //   expect.assertions(3);
  //   const { getByText } =
  //         renderWithRouter({ auth: token, updateAdminToken: () => {} })(Activities);
  //   const [baking, yoga, selfDefence] = await waitForElement(() => [
  //     getByText('Baking Lessons'),
  //     getByText('Yoga'),
  //     getByText('Self-Defence Class'),
  //   ]);

  //   expect(baking.textContent).toEqual('Baking Lessons');
  //   expect(yoga.textContent).toEqual('Yoga');
  //   expect(selfDefence.textContent).toEqual('Self-Defence Class');
  // });

  test('add :: correct response adds new row', async () => {
    expect.assertions(1);
    const { getByText, getByLabelText } =
          renderWithRouter({ auth: token, updateAdminToken: () => {} })(Activities);

    const input = getByLabelText('Add an activity');
    const add = getByText('ADD');
    await waitForElement(() => getByText('Yoga'));
    input.value = 'Cycling';
    fireEvent.change(input);
    fireEvent.click(add);

    const cycling = await waitForElement(() => getByText('Cycling'));

    expect(cycling.textContent).toEqual('Cycling');
  });

  // test('update :: correct response updates specified row', async () => {
  //   // expect.assertions(2);
  //   const { getByAltText, debug } =
  //         renderWithRouter({ auth: token, updateAdminToken: () => {} })(Activities);

  //   const checkbox = await waitForElement(() => getByAltText('Baking Lessons monday update button'));
  //   expect(checkbox.checked).toBeFalsy();
  //   fireEvent.click(checkbox);

  //   await wait(() => {
  //     const updatedCheck = getByAltText('Baking Lessons monday update button');
  //     // debug();
  //     return expect(updatedCheck.checked).toBeTruthy();
  //   });
  // });

  // test('delete :: correct response deletes specified row', async () => {
  //   expect.assertions(1);
  //   const { getByText, getByTestId } =
  //       renderWithRouter({ auth: token, updateAdminToken: () => {} })(Activities);

  //   const [frenchLessons, deleteButton] = await waitForElement(() => [
  //     getByText('French Lessons'),
  //     getByTestId('Delete French Lessons')]);

  //   fireEvent.click(deleteButton);

  //   await wait(() => expect(frenchLessons).not.toBeInTheDocument(),
  //   );
  // });
});
