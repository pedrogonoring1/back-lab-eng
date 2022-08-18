import 'reflect-metadata';

import { expect } from 'chai';
import request from 'supertest';

import { getTestContainer } from '../helpers/getTestContainer';
import Server from '../../src/lib/Server';

describe('ExampleController', () => {
  const server = getTestContainer().get(Server).app;

  describe('POST /example', () => {
    const body = {
      data: {
        description: 'yessir',
      },
    };

    describe('when the correct params are provided', () => {
      it('creates the example', async () => {
        const res = await request(server).post('/example').send(body);

        expect(res.status).to.eql(201);
        expect(res.body).to.deep.eq({
          data: {
            id: res.body.data.id,
            description: body.data.description,
          },
        });
      });
    });
  });
});
