function compare( a, b ) {
    if ( a.playtime_forever < b.playtime_forever ){
      return 1;
    }
    if ( a.playtime_forever > b.playtime_forever ){
      return -1;
    }
    return 0;
}

module.exports = (arr) => {
    return arr.sort(compare);
};