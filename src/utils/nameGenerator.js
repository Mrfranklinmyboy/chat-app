import Chance from 'chance';

const chance = new Chance();

export const generateUsername = () => {
  return chance.first();
};
