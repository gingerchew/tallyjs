/**
 * @TODO: Prefix & Suffix like $ and %
 * @TODO: Intl.NumberFormat
 *  - Solves issues like grouping. 1,000 vs 1000
 *  - Solves issues with decimals and separators. 1.000,05 vs 1,000.05 vs 1 000.05 etc
 * @TODO: Easing?
 *  - Least likely to be added
 * @TODO: Extract util functions where possible
 */

const validNum = n => typeof n === 'number' && isNaN(n) === false;
const countUp = (start, end, prog, dur) => start + (end - start) * (prog / dur);
const countDown = (start, end, prog, dur) => start - ((start - end) * (prog / dur));
const generateFormatter = (locale, options, override) => {
    console.log(locale, options, override);
    if (!override) return { format: (v) => v };
    if (locale === null) return new Intl.NumberFormat();
    return new Intl.NumberFormat(locale, options);
}
class Tally {
	constructor(el) {
		this.el = el;
		this.dur = parseFloat(el.dataset.duration || '1') * 1000;
		this.startTime = false;
		this.endVal = parseFloat(el.dataset.count || '0');
		this.startVal = el.textContent.length > 0 && validNum(+el.textContent) ? +el.textContent : 0;
		this.dec = parseInt(el.dataset.decimal || '0');
		this.done = false;
        this.group = true;
        if ('group' in el.dataset && el.dataset.group === 'false') {
            this.group = false;
        }

		this.tagType = el.localName === 'input' ? 
            'input' : 
            el.tagName === 'text' || el.tagName === 'tspan' ?
                'text' :
                'element';
        /** true == count down, false == count up */
        this.down = this.startVal > this.endVal

        this.formatter = generateFormatter(el.dataset.locale || null, JSON.parse(el.dataset.format || '{}'), this.group);

		if ('scroll' in el.dataset) {
			this.observer = new IntersectionObserver((entries, observer) => {
				for (let entry of entries) {
					if (entry.isIntersecting) {
						this.count();
						
						if (el.dataset.scroll === 'once') {
							observer.disconnect();
                            this.observer = null;
						}
					} else {
						this.reset();
					}
				}
			});
			this.observer.observe(el);
		}
	}
	
	count(ts) {
		if (this.done) this.reset();

		if (ts === undefined) {
			this.rAF = requestAnimationFrame(this.count.bind(this));
			return;
		}
		if (!this.startTime) {
			this.startTime = ts;
		}
		
		let progress = ts - this.startTime;
		this.remaining = this.dur - progress;

		let nextVal = this.dir ? 
            countUp(this.startVal, this.endVal, progress, this.dur) : 
            countDown(this.startVal, this.endVal, progress, this.dur);
		
		if (this.down && nextVal < this.endVal) {
			nextVal = this.endVal;
		} else if (!this.down && nextVal > this.endVal) {
            nextVal = this.endVal;
        }

        nextVal = parseFloat(nextVal.toFixed(this.dec));
        if (this.formatter) nextVal = this.formatter.format(nextVal);

		this.frameVal = nextVal;
		if (progress < this.dur) {
			this.rAF = requestAnimationFrame(this.count.bind(this));
		} else {
			this.done = true;
		}
	}
	
	reset() {
		this.done = false;
		this.frameVal = this.startVal;
		this.startTime = false;
		cancelAnimationFrame(this.rAF);
	}
	
	set frameVal(v) {
        switch (this.tagType) {
            case 'input':
                this.el.value = v;
            case 'element':
            case 'text':
                this.el.textContent = v;
            default:
                this.el.textContent = v;
        }
	}
	
	get frameVal() {
		return this.el.textContent
	}
}

export {
    Tally
}