import {Vector3} from 'three';

/**
 * Correct modulus function
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Generate list of all 27 positions (including the centre) of a 3x3 cube
 * @returns {Vector3[]}
 */
function generateMooreNeighbourhood() {
    const idxs = [-1, 0, 1];
    const positions = [];
    for (const x of idxs) {
        for (const y of idxs) {
            for (const z of idxs) {
                positions.push(new Vector3(
                    x, y, z
                ));
            }
        }
    }
    return positions;
}

const mooreNeighbourhood = generateMooreNeighbourhood();

/**
 * Calculate pseudorandom integer value between zero and maxVal
 * @param {number} maxVal Maximum value
 * @returns {number}
 */
function getRandomInt(maxVal) {
  return Math.floor(Math.random() * maxVal);
}

function collides(p1, p2) {
    return p1.distanceToSquared(p2) < 0.1;
}

export {mod, mooreNeighbourhood, getRandomInt, collides};