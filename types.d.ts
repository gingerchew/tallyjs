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
interface TallyOptions {
    end: number;
    start: number;
    decimals: number;
    // formatter: ;
    locale: string;
    dir: 1|-1;
}