import { checkInput } from './inputCheck.js';

describe('RegExp: input', function () {
  it('should be a string not a number', function () {
    const urlRGEX = /^[a-zA-Z\s]{0,255}$/;
    const urlTest = 'R0ma';
    expect(urlRGEX.test(urlTest)).toBe(false);
  });
});