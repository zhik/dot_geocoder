import XLSX from 'xlsx';

const exportExcel = (fileName, data) => {
    
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
    
    /* add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws);

    /* write workbook */
    XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'base64'})
    XLSX.writeFile(wb, `${fileName}-geocoded.xlsx`);
}

export default exportExcel;