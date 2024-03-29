import {UniformColor, UniformMatrix4f, Uniform1i, Uniform1f} from '../uniform_binding';

import type {Context} from '../../gl/context';
import type {UniformValues, UniformLocations} from '../uniform_binding';
import type {Color} from '@maplibre/maplibre-gl-style-spec';
import {mat4} from 'gl-matrix';

export type DebugUniformsType = {
    'u_color': UniformColor;
    'u_matrix': UniformMatrix4f;
    'u_overlay': Uniform1i;
    'u_overlay_scale': Uniform1f;
};

const debugUniforms = (context: Context, locations: UniformLocations): DebugUniformsType => ({
    'u_color': new UniformColor(context, locations.u_color),
    'u_matrix': new UniformMatrix4f(context, locations.u_matrix),
    'u_overlay': new Uniform1i(context, locations.u_overlay),
    'u_overlay_scale': new Uniform1f(context, locations.u_overlay_scale)
});

const debugUniformValues = (matrix: mat4, color: Color, scaleRatio: number = 1): UniformValues<DebugUniformsType> => ({
    'u_matrix': matrix,
    'u_color': color,
    'u_overlay': 0,
    'u_overlay_scale': scaleRatio
});

export {debugUniforms, debugUniformValues};
