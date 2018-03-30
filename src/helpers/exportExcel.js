import XLSX from 'xlsx';

const exportExcel = (data) => {
    var filename = "write.xlsx";
    
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
    
    /* add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws);

    /* write workbook */
    XLSX.writeFile(wb, filename);
}

export default exportExcel;