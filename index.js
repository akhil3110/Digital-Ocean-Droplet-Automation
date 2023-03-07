var shell = require('shelljs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require("./pass.json")
const prompt=require("prompt-sync")({sigint:true}); 
const date= new Date();

const getAuth = async (id) => {
    try {
      // https://docs.google.com/spreadsheets/d/1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ/edit?usp=sharing
      const doc = new GoogleSpreadsheet(id)
      await doc.useServiceAccountAuth(creds)
      await doc.loadInfo()
      return doc
    } catch (e) {
      return e.message
    }
  }


// Initialize the sheet - doc ID is the long id in the sheets URL
const main =async() =>{
    try {
        const doc = await getAuth("1df0PbQJJVPO9qXI9w9gVlqX02rErPHxJ2IVk2GnokfQ")
        const d=await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        await sheet.loadCells('A1:E100');
        
        var ch = 'y';
        while(ch=='y' || ch=='Y'){
          var command = prompt("Enter Command to run ");
          for (key in rows) {
              if(rows[key][sheet.headerValues[1]]== command){
                if(rows[key][sheet.headerValues[2]]=='n' || rows[key][sheet.headerValues[2]]=='N' ){
                  shell.exec(`${rows[key][sheet.headerValues[0]]}`)
                  var num = +key;
                  const run_status = sheet.getCell(num+1,2);
                  run_status.value='y';
                  const date_field = sheet.getCell(num+1,4);
                  date_field.value=`${date}`;
                  await sheet.saveUpdatedCells();
                }else{
                  console.log("Command Already ececuted")
                }
              } 
          }
          ch=prompt("Do you want to run more commands ")
        }
        
    } catch (error) {
        console.log(error)
    }
}

main()



