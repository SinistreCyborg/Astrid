/* eslint-disable import/prefer-default-export */

export const APIs = {
    CRATE: term => `https://crates.io/api/v1/crates/${term}`,
    GO: term => `https://api.godoc.org/search?q=${encodeURIComponent(term)}`,
    YARN: term => `https://api.npms.io/v2/search?q=${term}`,
    BREW: 'https://formulae.brew.sh/api/formula.json',
};
