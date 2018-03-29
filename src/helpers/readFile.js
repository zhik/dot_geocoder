import XLSX from 'xlsx';

const supportedExtension = ['csv','tsv','txt','xls','xlsx'];

const readFile = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        /* Check file extension */
        const extension = file.name.split('.').pop().toLowerCase();
        if(supportedExtension.indexOf(extension) === -1) reject('file type not supported');
        const rABS = !!reader.readAsBinaryString;
        reader.onload = e => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header:1});
            /* Update state */
            resolve(data);
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
        

    })
}

export default readFile;