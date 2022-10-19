export default function authHeader() {
    const adminStr = window.localStorage.getItem("admin");
    
    type adminType = {
        accessToken: String
    }

    let admin : adminType = {accessToken: ""};

    if (adminStr)
        admin = JSON.parse(adminStr);

    if (admin && admin.accessToken) {
        return { Authorization: 'Bearer ' + admin.accessToken };

    } else {
        return { Authorization: '' };
    }
}