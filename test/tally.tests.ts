// @vitest-environment jsdom
import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest';
import { Tally } from '../src/index';


beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0; });
})

afterEach(() => {
    // @ts-ignore
    window.requestAnimationFrame.mockRestore()
})

describe('Check API', () => {
    const el = { textContent: '' } as HTMLElement;
    const api = Tally(el, {});

    test('Has Count', () => expect(Object.hasOwn(api, 'count')).toBe(true));
    test('Has Stop', () => expect(Object.hasOwn(api, 'stop')).toBe(true));
})

describe('Counts:', async () => {
    const el = {
        textContent: ''
    }
    test('Start', () => {
        el.textContent = '';

        Tally(el as HTMLElement, { start: 0 });

        expect(el.textContent).toBe('0');
    });

    test('End', () => {
        el.textContent = '';

        const counter = Tally(el as HTMLElement, {
            end: 10,
            start: 0
        })
        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('10');
    });

    test('Direction: ', () => {
        el.textContent = '';

        const counter = Tally(el as HTMLElement, {
            dir: -1,
            start: 0,
            end: -10,
        });

        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('-10');
    });
});

describe('Prefix & Suffix', () => {
    const el = { textContent: '' } as HTMLElement;
    test('Prefix: $', () => {
        const counter = Tally(el, {
            prefix: '$',
            start: 0,
            end: 10
        });

        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('$10');
    });

    test('Suffix: $', () => {
        el.textContent = '';

        const counter = Tally(el, {
            start: 0,
            end: 10,
            suffix: '$'
        });

        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('10$')
    })


    test('Prefix and Suffix: $', () => {
        el.textContent = '';

        const counter = Tally(el, {
            start: 0,
            end: 10,
            suffix: '$',
            prefix: '$'
        });

        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('$10$')
    });
});

describe('Decimals', () => {
    const el = {
        textContent: ''
    } as HTMLElement;

    test('Right length', () => {
        const counter = Tally(el, {
            decimals: 2,
            start: 0,
            end: 10
        });

        expect(el.textContent?.length).toBe(1);

        counter.count();

        expect(el.textContent?.length).toBe(5);
    });

    test('Has separator: .', () => {
        const counter = Tally(el, {
            decimals: 2,
            start: 0,
            end: 10
        });

        expect(el.textContent?.indexOf('.')).toBe(-1);

        counter.count();

        expect(el.textContent?.indexOf('.')).toBe(2);
    })

    test('2 Decimals', () => {
        const counter = Tally(el, {
            decimals: 2,
            start: 0,
            end: 10
        });

        expect(el.textContent).toBe('0');

        counter.count();

        expect(el.textContent).toBe('10.00');
    });

    // handle case where decimals = -2 (meaning that the number added would be 100 instead of -0.01)
});


describe('Intl.NumberFormatOptions', () => {
    const el = { textContent: '' } as HTMLElement;
    test('locale', () => {
        const counter = Tally(el, {
            locale: 'en-DE',
            start: 0,
            end: 10000.01
        });

        counter.count();

        expect(el.textContent).toBe('10.000,01');
    });


    test('useGrouping', () => {

        const opts = {
            end: 1000,
            formatterOptions: {
                useGrouping: false,
            } as Intl.NumberFormatOptions
        };

        /* @TODO: What about 'always', 'min2' as options? Like the docs? */
        let counter = Tally(el, opts);
        counter.count();

        expect(el.textContent).toBe('1000');
        opts.formatterOptions.useGrouping = true;
        counter = Tally(el, opts);

        counter.count();

        expect(el.textContent).toBe('1,000');
    });

    test('signDisplay', () => {
        const opts = {
            end: 1000,
            formatterOptions: {
                signDisplay: 'auto'
            } as Intl.NumberFormatOptions
        }

        Tally(el, opts).count();

        expect(el.textContent).toBe('1,000');

        opts.end = -1000;

        Tally(el, opts).count();
        console.log(el.textContent);
        expect(el.textContent).toBe('-1,000');
    })
});
