import type {CullFaceModeType, FrontFaceType} from './types';

const BACK = 0x0405;
const CCW = 0x0901;

export class CullFaceMode {
    enable: boolean;
    mode: CullFaceModeType;
    frontFace: FrontFaceType;

    constructor(enable: boolean, mode: CullFaceModeType, frontFace: FrontFaceType) {
        this.enable = enable;
        this.mode = mode;
        this.frontFace = frontFace;
    }

    static disabled: Readonly<CullFaceMode>;
    static backCCW: Readonly<CullFaceMode>;
}

CullFaceMode.disabled = new CullFaceMode(false, BACK, CCW);
CullFaceMode.backCCW = new CullFaceMode(true, BACK, CCW);
