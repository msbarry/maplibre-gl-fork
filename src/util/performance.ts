import type {RequestParameters} from '../util/ajax';
import type {WorkerTileCallback, WorkerTileResult} from '../source/worker_source';

export type PerformanceMetrics = {
    loadTime: number;
    fullLoadTime: number;
    fps: number;
    percentDroppedFrames: number;
    totalFrames: number;
};

export enum PerformanceMarkers {
    create = 'create',
    load = 'load',
    fullLoad = 'fullLoad'
}

let lastFrameTime = null;
let frameTimes = [];

const minFramerateTarget = 60;
const frameTimeTarget = 1000 / minFramerateTarget;

const loadTimeKey = 'loadTime';
const fullLoadTimeKey = 'fullLoadTime';

export const PerformanceUtils = {
    mark(marker: PerformanceMarkers) {
        performance.mark(marker);
    },
    frame(timestamp: number) {
        const currTimestamp = timestamp;
        if (lastFrameTime != null) {
            const frameTime = currTimestamp - lastFrameTime;
            frameTimes.push(frameTime);
        }
        lastFrameTime = currTimestamp;
    },
    clearMetrics() {
        lastFrameTime = null;
        frameTimes = [];
        performance.clearMeasures(loadTimeKey);
        performance.clearMeasures(fullLoadTimeKey);

        for (const marker in PerformanceMarkers) {
            performance.clearMarks(PerformanceMarkers[marker]);
        }
    },

    getPerformanceMetrics(): PerformanceMetrics {
        performance.measure(loadTimeKey, PerformanceMarkers.create, PerformanceMarkers.load);
        performance.measure(fullLoadTimeKey, PerformanceMarkers.create, PerformanceMarkers.fullLoad);
        const loadTime = performance.getEntriesByName(loadTimeKey)[0].duration;
        const fullLoadTime = performance.getEntriesByName(fullLoadTimeKey)[0].duration;
        const totalFrames = frameTimes.length;

        const avgFrameTime = frameTimes.reduce((prev, curr) => prev + curr, 0) / totalFrames / 1000;
        const fps = 1 / avgFrameTime;

        // count frames that missed our framerate target
        const droppedFrames = frameTimes
            .filter((frameTime) => frameTime > frameTimeTarget)
            .reduce((acc, curr) => {
                return acc + (curr -  frameTimeTarget) / frameTimeTarget;
            }, 0);
        const percentDroppedFrames = (droppedFrames / (totalFrames + droppedFrames)) * 100;

        return {
            loadTime,
            fullLoadTime,
            fps,
            percentDroppedFrames,
            totalFrames
        };
    }
};

/**
 * @internal
 * Safe wrapper for the performance resource timing API in web workers with graceful degradation
 */
export class RequestPerformance {
    _marks: {
        start: string;
        end: string;
        measure: string;
    };

    constructor (request: RequestParameters) {
        this._marks = {
            start: [request.url, 'start'].join('#'),
            end: [request.url, 'end'].join('#'),
            measure: request.url.toString()
        };

        performance.mark(this._marks.start);
    }

    finish() {
        performance.mark(this._marks.end);
        let resourceTimingData = performance.getEntriesByName(this._marks.measure);

        // fallback if web worker implementation of perf.getEntriesByName returns empty
        if (resourceTimingData.length === 0) {
            performance.measure(this._marks.measure, this._marks.start, this._marks.end);
            resourceTimingData = performance.getEntriesByName(this._marks.measure);

            // cleanup
            performance.clearMarks(this._marks.start);
            performance.clearMarks(this._marks.end);
            performance.clearMeasures(this._marks.measure);
        }

        return resourceTimingData;
    }
}

export const timeOrigin = performance ? (performance.timeOrigin || (new Date().getTime() - performance.now())) : new Date().getTime();

export class Timeline {
    _marks: {[_: string]: number[]};

    constructor () {
        this._marks = {};
        this.mark();
    }

    mark = (id?: string): void => {
        if (performance) {
            const _id = id || '';
            this._marks[_id] = this._marks[_id] || [];
            this._marks[_id].push(performance.now());
        }
    }

    finish = (): {[_: string]: any} => {
        this.mark();
        return {...this._marks, timeOrigin};
    }

    wrapCallback = (callback: WorkerTileCallback): WorkerTileCallback => {
        return (error?: Error, result?: WorkerTileResult) => {
            const perfTiming = this.finish();
            const modifiedResult = result ? {...result, perfTiming} : result;
            return callback(error, modifiedResult);
        };
    }
}

export default performance;
