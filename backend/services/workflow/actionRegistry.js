
export const actionRegistry={
       SEND_APPROVAL_EMAIL: async(context)=>{
           console.log("sending approval email");

           /*
            TODO

            gmailTools.sendMail({
                to,
                subject,
                body
            });

        */

       },
        UPDATE_GOOGLE_SHEET: async (context) => {

        console.log("Updating Google Sheet");

        /*
            TODO

            sheetsTools.updateRow({
                purchaseId,
                status:"Approved"
            });

        */

    }
}