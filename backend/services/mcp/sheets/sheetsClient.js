import axios from "axios";

const WEBHOOK_URL ="https://script.google.com/macros/s/AKfycbx_sqYbSAoPjRA-Dbw6rI7fIcuTQ14SBS9kztnbjSuUdbF3flwMtJcdp1WmzAC9FjU/exec";

export async function retrieveBudget({ department }) {

    try {

        const response = await axios.get(WEBHOOK_URL, {
            params: {
                department
            }
        });

        return response.data;

    } catch (err) {

        console.error(err.message);
        return null;

    }

}

export async function updateBudget({
    department,
    spent,
    remaining
}) {
    try {

        const response = await axios.post(
            WEBHOOK_URL,
            {
                department,
                spent,
                remaining
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (err) {

        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        console.log("Message:", err.message);

        throw err;
    }
}