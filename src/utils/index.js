export const setupArrays = () => {
    Array.prototype.shuffle = function() {
        var i = this.length,
            j, temp;
        if (i == 0) return this;
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    }

    Array.prototype.toMatriz = function(subArrLength) {
        return this.reduce((acc, current, index) => {
            if (index % subArrLength == 0) {
                acc.push([current])
            } else {
                acc[acc.length - 1].push(current);
            }
            return acc
        }, []);
    }



}


export const generateGoals = (maxNumberOfGoals) => {
    return Math.floor(Math.random() * maxNumberOfGoals);
}


export const mergeTwoArrays = (arr1, arr2) => {
    let arrMerged = []
    let auxArr2 = [...arr2]

    arrMerged = arr1.reduce((acc, current) => {
        return acc.concat(current, auxArr2.splice(0, 1).flat());
    }, []);
    if (auxArr2.length > 0) { arrMerged.push(...auxArr2.flat()) }
    return arrMerged;
}