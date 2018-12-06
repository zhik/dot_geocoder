import { flatten } from 'flat';

/**
 * takes an obj with many keys with nested values of different types. 
 * returns an obj that will flatten some of those key.values to string for export
 * 
 * parent[child] -> parent.child 
 * 1 nested arrays : [1 , 2 , 3] -> "1,2,3"
 * 
 * use for the debug, and nested items like onstreet/ crossstreet details
 * 
 * @param {*} obj 
 */
export default function flattenFields(obj){

    const safeFlat = flatten(obj, { maxDepth: 3, safe: true });
    
    //modify some fields so they common aren't unqiue
    const commonFlat = Object.keys(safeFlat).reduce((commonFlat,key) => {
        const keyArray = key.split('.')
        if(['CrossStreetOne','CrossStreetTwo','IntersectingStreets','Street'].some(unqiueKey => !keyArray.includes('debug') && keyArray.includes(unqiueKey))){
            //remove the unqiue item from array, usally the 2nd item
            const name = keyArray.splice(1,1)[0];
            if(safeFlat[key]){
                commonFlat[keyArray.join('.')] = concatUnqiue(commonFlat[keyArray.join('.')], safeFlat[key]);
            }

            if(keyArray[0] && name){
                //add new key with the name of the unqiue field 
                commonFlat[`${keyArray[0]}.Name`] = concatUnqiue(commonFlat[`${keyArray[0]}.Name`], name);
            }

            
        }else if(['geojson'].some(removeKey => keyArray.includes(removeKey))){
            //don't include some fields
            
        }else{
            commonFlat[key] = safeFlat[key];
        }
        return commonFlat;
    },{})

    //flatten arrays
    const arrayFlat = Object.keys(commonFlat).reduce((arrayFlat, key)=> {
        if(Array.isArray(commonFlat[key])){
            const stringifiedArray = commonFlat[key].map(i => {
                if(typeof(i) !== 'object'){
                    return i;
                }else{
                    return JSON.stringify(i);
                }
            }).join(', ');
            if(stringifiedArray) arrayFlat[key] = stringifiedArray;
        }else{
            arrayFlat[key] = commonFlat[key];
        }
        return arrayFlat;
    },{})
    

    return arrayFlat;
}

function concatUnqiue(field, value){
    //return value if field blank, otherwise return field, if unqiue append value. (may not include some edge cases)
    if(field){
        if(!field.includes(value)){
            return `${field}, ${value}`;
        }else{
            return field;
        }
    }
    return value;
}