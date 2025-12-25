import {Vector3} from 'three';

function mod(n, m) {
  return ((n % m) + m) % m;
}

function generateMooreNeighbourhood() {
    const idxs = [-1, 0, 1];
    const positions = [];
    for (const x of idxs) {
        for (const y of idxs) {
            for (const z of idxs) {
                positions.push( new Vector3(
                    x, y, z
                ));
            }
        }
    }
    return positions;
}
const mooreNeighbourhood = generateMooreNeighbourhood();

function getRandomInt(maxVal) {
  return Math.floor(Math.random() * maxVal);
}

export {mod, mooreNeighbourhood, getRandomInt};