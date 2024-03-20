function luuDuLieu(key: string, duLieu: any) {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem(key, JSON.stringify(duLieu));
            resolve("localStorage.setItem.success");
        } catch (error) {
            reject(error);
        }
    });
}
function layDuLieu(key: string) {
    const duLieu = localStorage.getItem(key);
    if (!duLieu) {
        return undefined;
    }
    try {
        return JSON.parse(duLieu);
    } catch (error) {
        return undefined;
    }
}
export { luuDuLieu, layDuLieu };

