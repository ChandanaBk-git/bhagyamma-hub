import API from "../api";

export const getSellingPoints =
async () => {

    const response =
        await API.get(
            "/users/selling-points"
        );

    return response.data.data;

};