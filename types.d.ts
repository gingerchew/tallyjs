/**
 * 
 * @param {HTMLElement} el 
 * @param {object} options 
 * @prop {number} options.end
 * @prop {number} options.start
 * @prop {number} options.decimals
 * @prop {Intl.ResolvedNumberFormatOptions} formatter
 * @prop {string} locale
 * @prop {1|-1} dir
 * @returns 
 */
export interface TallyOptions {
    end?: number;
    start?: number;
    decimals?: number|false;
    formatterOptions?: Intl.NumberFormatOptions; // should be the options for Intl.NumberFormat - locale
    locale?: string;
    dir?: 1|-1;
    prefix?: string;
    suffix?: string;
    duration?: number;
    customFormatter?: {
        [index: string]: unknown;
        format: (num: number) => string;
    }
}

export interface TallyAPI {
    count: (ts?:number) => void;
    stop: () => void;
}

export type Tally = (el:HTMLElement, options: TallyOptions) => TallyAPI