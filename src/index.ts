import { Tally, TallyOptions } from "../types";

const noop = () => {};

const generateFormatter = (locale:string, options:object) => new Intl.NumberFormat(locale, options);
const caf = cancelAnimationFrame;

/**
 * 
 * Plugin system
 * 
 * api.use(function(fn) {
 *  fn(api, end, num)
 * })
 * 
 * 
 */


const Tally:Tally = (el, options) => {
    let {
        end,
        start,
        decimals,
        formatterOptions,
        locale,
        dir,
        prefix,
        suffix,
        duration
    } = Object.assign<Required<TallyOptions>, TallyOptions>({
        end: +(el.textContent ?? 0),
        start: 0,
        decimals: 0,
        formatterOptions: {},
        // @ts-ignore
        customFormatter: noop,
        locale: 'en-US',
        dir: 1,
        prefix: '',
        suffix: '',
        duration: 2
    }, options);
    
    let opts = {
        minimumFractionDigits: decimals,
        ...formatterOptions
    };

    const f = generateFormatter(locale, opts);

    // parse the nums
    // @TODO: allow for floats
    end = +(end ?? 0);
    start = +(start ?? 0);
    
    let frame = start;
    let startTime:number;
    el.textContent = ''+start;

    let handle:number;
    const validate = () => dir === 1 ? frame >= end : frame <= end;

    const count = (ts:number = 0) => {
        if (!startTime) startTime = ts;

        const progress = ts - startTime
        // const remaining = duration - progress
        // if at the end, end
        // @TODO: count based on duration/progress instead of fixed amount
        // frame = frame + dir / (10 ** +decimals);
        
        // based on duration
        frame = start + (end - start) * (progress / duration);
        
        if (!validate()) {
            frame = end;
        }
        
        /**
         * This checking with validation may cause the number shown to be off for a frame
         * 
         * e.g.
         * 
         * end = 20,
         * decimals = 2;
         * 0 -> 20.00
         * 
         * while increasing, if num >= end, cancel the active frame,
         * for a frame it could be 20.01;
         */
        el.textContent = `${prefix}${f.format(frame)}${suffix}`;
        if (validate()) {
            caf(handle);
            return;
        }
        // save animationFrame
        handle = requestAnimationFrame(count);
    }

    // "api"
    return {
        count, //: () => new Promise((res) =>  count(res)),
        stop: () => caf(handle),
        use: noop,
    }
}

export { Tally }