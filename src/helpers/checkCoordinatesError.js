export default function checkCoordinatesError(item){
    //expects number, string, or array, checks if any element in the item is undef. , 0, or NaN
    //returns true of them
    if(Array.isArray(item)){
        return !item.length || item.some(subItem => checkCoordinatesError(subItem));
    }else{
        return !item;
    }
}