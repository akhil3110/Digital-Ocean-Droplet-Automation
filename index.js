var shell = require('shelljs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require("./pass.json")


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
        console.log(doc.title);
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows(); 
        for (key in rows) {
            console.log(key)
           shell.exec(`${rows[key][sheet.headerValues[0]]}`)
        }
    } catch (error) {
        console.log(error)
    }
}

main()



