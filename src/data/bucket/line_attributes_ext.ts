import {createLayout} from '../../util/struct_array';

export const lineLayoutAttributesExt = createLayout([
    {name: 'a_uv_x', components: 1, type: 'Float32'},
    {name: 'a_split_index', components: 1, type: 'Float32'},
]);

export const {members, size, alignment} = lineLayoutAttributesExt;
