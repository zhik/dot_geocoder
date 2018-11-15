import XLSX from 'xlsx';

const supportedExtension = ['csv','tsv','txt','xls','xlsx'];

export function readSheetNames(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        /* Check file extension */
        const extension = file.name.split('.').pop().toLowerCase();
        if(!supportedExtension.includes(extension)){
            reject('file type not supported');
        }
        const rABS = !!reader.readAsBinaryString;
        reader.onload = e => {
            if(!supportedExtension.includes(extension)){
                reject('file type not supported');
            }else{
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
            resolve(wb.SheetNames);
            }
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    })
}


const readFile = (file, sheetNumber = 0) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        /* Check file extension */
        const extension = file.name.split('.').pop().toLowerCase();
        if(!supportedExtension.includes(extension)){
            reject('file type not supported');
        }
        const rABS = !!reader.readAsBinaryString;
        reader.onload = e => {
            if(!supportedExtension.includes(extension)){
                reject('file type not supported');
            }else{
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
                const wsname = wb.SheetNames[sheetNumber];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, {header:1});
                /* Remove empty object arrays */
                const cleanData = data.filter(array => array.length > 0);
                /* Update state */
                resolve(cleanData);
            }
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
        

    })
}

export default readFile;