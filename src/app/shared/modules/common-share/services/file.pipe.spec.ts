import { FilePipe } from './file.pipe';

describe('FilePipe', () => {
  it('create an instance', () => {
    const pipe = new FilePipe({} as any);
    expect(pipe).toBeTruthy();
  });
});
