const locale = require('cldr-language-country');

module.exports = function getLocaleCodes({ country, language, cc, lc } = {}) {
    if (cc && lc) {
        return { cc, lc };
    } else if (lc) {
        const data = locale.getByLC(lc);
        return { lc, cc: data.country.code };
    } else if (country) {
        const data = locale.getByCountryName(country);
        return { lc: data.language.code, cc: data.country.code };
    } else if (language) {
        const data = locale.getByLanguageName(language);
        return { lc: data.language,code, cc: data.country.code };
    } else {
        return null;
    }
}