import { round } from './core';
import { 
   Vector
} from './vector';

describe('vector', () => {
  it('Vector', () => {
    const vec = new Vector(1,2,3)
    expect(vec).toBeTruthy;
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(2);
    expect(vec.z).toEqual(3);
  });

  it('Vector/add', () => {
    const vec = new Vector(1,2,3);
    const newVec = vec.add(new Vector(1,1,1));
    expect(newVec.x).toEqual(2);
    expect(newVec.y).toEqual(3);
    expect(newVec.z).toEqual(4);
  });

  it('Vector/sub', () => {
    const vec = new Vector(1,2,3);
    const newVec = vec.sub(new Vector(1,1,1));
    expect(newVec.x).toEqual(0);
    expect(newVec.y).toEqual(1);
    expect(newVec.z).toEqual(2);
  });

  it('Vector/absoluteValue', () => {
    const vec = new Vector(1,2,3);
    expect(round(vec.absoluteValue(), 4)).toEqual(3.7417);
  });

  it('Vector/innerProduct', () => {
    const vec = new Vector(1,2,3);
    const res = vec.innerProduct(new Vector(4,5,6));
    expect(res).toEqual(32);
  });

  it('Vector/vectorProduct', () => {
    const vec = new Vector(1,2,3);
    const newVec = vec.vectorProduct(new Vector(4,5,6));
    expect(newVec.x).toEqual(-3);
    expect(newVec.y).toEqual(6);
    expect(newVec.z).toEqual(-3);
  });

  it('Vector/einheitsvektor', () => {
    const vec = new Vector(1,2,3).einheitsvektor();
    expect(vec.x).toEqual(0.2672612419124244);
    expect(vec.y).toEqual(0.5345224838248488);
    expect(vec.z).toEqual(0.8017837257372732);
  });
});
