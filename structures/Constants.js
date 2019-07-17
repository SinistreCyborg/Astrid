/* eslint-disable import/prefer-default-export */

export const APIs = {
    CRATE: term => `https://crates.io/api/v1/crates/${term}`,
    GO: term => `https://api.godoc.org/search?q=${encodeURIComponent(term)}`,
    YARN: term => `https://api.npms.io/v2/search?q=${term}`,
    BREW: 'https://formulae.brew.sh/api/formula.json',
    GEM: term => `https://rubygems.org/api/v1/gems/${term}.json`,
    CLOJURE: term => `https://clojars.org/api/artifacts/${term}`,
    NET: term => `https://api-v2v3search-0.nuget.org/query?q=${encodeURIComponent(term)}`,
    ELIXIR: term => `https://hex.pm/api/packages?search=${term}`,
    PIP: term => `https://pypi.python.org/pypi/${term}/json`,
    DART: term => `https://pub.dev/api/packages/${term}`,
    GITHUB: repo => `https://api.github.com/repos/${repo}`,
    MDN: term => `https://developer.mozilla.org/en-US/search.json?q=${encodeURIComponent(term)}`,
};
