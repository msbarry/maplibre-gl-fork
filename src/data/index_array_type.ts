import {LineIndexArray, TriangleIndexArray, LineStripIndexArray} from './array_types.g';

/**
 * An index array stores Uint16 indices of vertexes in a corresponding vertex array. We use
 * three kinds of index arrays: arrays storing groups of three indices, forming triangles;
 * arrays storing pairs of indices, forming line segments; and arrays storing single indices,
 * forming a line strip.
 */
export {LineIndexArray, TriangleIndexArray, LineStripIndexArray};
