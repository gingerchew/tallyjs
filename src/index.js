const generateFormatter = (locale, options) => new Intl.NumberFormat(locale || 'en-US', { ...options });

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
const Tally = (el, options) => {
    let {
        end,
        start,
        decimals,
        formatter,
        locale,
        dir
    } = Object.assign({
        end: el.textContent,
        start: 0,
        decimals: 0,
        formatter: {},
        locale: 'en-US',
        dir: 1,
    }, options);

    const f = generateFormatter(locale, {
        minimumFractionDigits: decimals,
        ...formatter
    })

    // parse the nums
    // @TODO: allow for floats
    end = +end;
    start = +start;
    let num = start;
    el.textContent = start;

    let handle = null;
    const count = () => {
        // if at the end, end
        if (num === end) return;
        num += dir / (10 ** decimals);
        el.textContent = f.format(num);

        // save animationFrame
        handle = requestAnimationFrame(count);
        
        // if past the end, end
        if (num >= end) {
            cancelAnimationFrame(handle);
        }
    }

    // "api"
    return {
        count,
        stop: () => cancelAnimationFrame(handle)
    }
}

export { Tally }