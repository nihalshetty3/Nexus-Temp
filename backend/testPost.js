import axios from "axios";

const url =
"https://script.google.com/macros/s/AKfycbx_sqYbSAoPjRA-Dbw6rI7fIcuTQ14SBS9kztnbjSuUdbF3flwMtJcdp1WmzAC9FjU/exec";

try {

    const response = await axios.post(
        url,
        {
            department: "IT",
            spent: 150000,
            remaining: 35
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    console.log(response.data);

} catch (err) {

    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);

}