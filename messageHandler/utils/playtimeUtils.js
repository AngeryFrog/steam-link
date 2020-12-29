const playTimeConvert = (mins) => {
    if(mins > 60){
        let hours = mins/60
        return `${Math.round((hours) * 10) / 10} hours`
    }else{
        return `${mins} minutes`
    };
};

const totalPlayTime = (arr) => {
    let timeAcc = 0;
    for(i=0; i<arr.length; i++){
        timeAcc += arr[i].playtime_forever;
    }
    return timeAcc;
};

module.exports = {
    totalPlayTime, 
    playTimeConvert
}