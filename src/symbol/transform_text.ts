import {plugin as rtlTextPlugin} from '../source/rtl_text_plugin';

import type {SymbolStyleLayer} from '../style/style_layer/symbol_style_layer';
import type {Feature} from '@maplibre/maplibre-gl-style-spec';
import {Formatted} from '@maplibre/maplibre-gl-style-spec';

function transformTextInternal(text: string, layer: SymbolStyleLayer, feature: Feature) {
    const transform = layer.layout.get('text-transform').evaluate(feature, {});
    if (transform === 'uppercase') {
        text = text.toLocaleUpperCase();
    } else if (transform === 'lowercase') {
        text = text.toLocaleLowerCase();
    }

    if (rtlTextPlugin.applyArabicShaping) {
        text = rtlTextPlugin.applyArabicShaping(text);
    }

    return text;
}

export function transformText(text: Formatted, layer: SymbolStyleLayer, feature: Feature): Formatted {
    text.sections.forEach(section => {
        section.text = transformTextInternal(section.text, layer, feature);
    });
    return text;
}
