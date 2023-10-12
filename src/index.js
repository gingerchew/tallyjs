const generateFormatter = (locale, options) => new Intl.NumberFormat(locale || 'en-US', { ...options });

const Tally = (el, options) => {
    let {
        end,
        start,
        decimals,
        formatter,
        locale,
    } = Object.assign({
        end: el.textContent,
        start: 0,
        decimals: 0,
        formatter: {},
        locale: 'en-US',
    }, options);

    const f = generateFormatter(locale, formatter)

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
        num += 1 / (10 ** decimals);
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