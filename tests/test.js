import readFile from './readFile';
import fitReader from '../src/index';

test('Can parse swimming file', () => {
  const data = readFile('./tests/samples/swimming.fit')
  const onProgress = (...args) => console.log('progress', ...args);
  const result = fitReader(data, onProgress);
  console.log('Done', result);
});
