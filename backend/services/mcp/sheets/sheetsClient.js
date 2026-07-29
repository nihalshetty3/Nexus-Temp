import axios from "axios";

const WEBHOOK_URL ="https://script.google.com/macros/s/AKfycbxCix8YLR3-y3cYtax-eJASWyAx5QnZL1YJc47IOGnP4POOnaq5PKuT_jfjrslxgVxR/exec"

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