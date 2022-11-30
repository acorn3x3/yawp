const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

describe('restaurant routes;', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /api/v1/restaurants shows a list of restaurants', async () => {
    const resp = await request(app).get('/api/v1/restaurants');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
          Array [
            Object {
              "cost": 1,
              "cuisine": "American",
              "id": "1",
              "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
              "name": "Pip's Original",
              "website": "http://www.PipsOriginal.com",
            },
            Object {
              "cost": 3,
              "cuisine": "Italian",
              "id": "2",
              "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/af/df/89/duck.jpg",
              "name": "Mucca Osteria",
              "website": "http://www.muccaosteria.com",
            },
            Object {
              "cost": 2,
              "cuisine": "Mediterranean",
              "id": "3",
              "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/f2/e5/0c/dinner.jpg",
              "name": "Mediterranean Exploration Company",
              "website": "http://www.mediterraneanexplorationcompany.com/",
            },
            Object {
              "cost": 2,
              "cuisine": "American",
              "id": "4",
              "image": "https://media-cdn.tripadvisor.com/media/photo-o/0d/d6/a1/06/chocolate-gooey-brownie.jpg",
              "name": "Salt & Straw",
              "website": "https://saltandstraw.com/pages/nw-23",
            },
          ]
      `);
  });
  it('GET /api/v1/restaurants/:restID shows restaurant detail', async () => {
    const resp = await request(app).get('/api/v1/restaurants/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "reviews": Array [
          Object {
            "detail": "Best restaurant ever!",
            "id": "1",
            "restaurant_id": "1",
            "stars": 5,
            "user_id": "1",
          },
          Object {
            "detail": "Terrible service :(",
            "id": "2",
            "restaurant_id": "1",
            "stars": 1,
            "user_id": "2",
          },
          Object {
            "detail": "It was fine.",
            "id": "3",
            "restaurant_id": "1",
            "stars": 4,
            "user_id": "3",
          },
        ],
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  const registerAndLogin = async () => {
    const agent = request.agent(app);
    const user = await UserService.create(mockUser);
    await agent
      .post('/api/v1/users/sessions')

      .send({ email: mockUser.email, password: mockUser.password });
    return [agent, user];
  };
  it('POST /api/v1/restaurants/reviews/:id creates a new review with a user who is logged in', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ detail: 'It was okay', stars: 5 });
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "detail": "It was okay",
        "id": "4",
        "restaurant_id": "1",
        "stars": 5,
        "user_id": "4",
      }
    `);
  });
  //   it('DELETE /api/v1/reviews/:id should delete the review if request is made by reviewer or admin', async () => {
  //     const [agent] = await registerAndLogin();
  //     await agent
  //       .post('/ap1/v1/restaurants/1/reviews')
  //       .send({ stars: 20, detail: 'wow, I live at this foodery now' });
  //     const resp = await agent.delete('/api/v1/reviews/4');
  //     expect(resp.status).toBe(204);
  //     const deleteResp = await agent.get('/api/v1/reviews/4');
  //     expect(deleteResp.status).toBe(404);
  //   });
});
