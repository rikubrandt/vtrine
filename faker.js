import { faker } from "@faker-js/faker";

export default function createRandomUser() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    company: faker.company.name(),
  };
}
