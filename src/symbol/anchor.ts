import Point from '@mapbox/point-geometry';

import {register} from '../util/web_worker_transfer';

export class Anchor extends Point {
    angle: any;
    segment?: number;

    constructor(x: number, y: number, angle: number, segment?: number) {
        super(x, y);
        this.angle = angle;
        if (segment !== undefined) {
            this.segment = segment;
        }
    }

    clone() {
        return new Anchor(this.x, this.y, this.angle, this.segment);
    }
}

register('Anchor', Anchor);
