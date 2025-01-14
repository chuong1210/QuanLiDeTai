import moment from "moment";

const getUserTimeZoneOffset = () => {
    const timeZoneOffset = new Date().getTimezoneOffset(); // Lấy offset (phút) từ UTC
    return -timeZoneOffset / 60; // Chuyển phút thành giờ (âm vì múi giờ phía đông UTC là số dương)
};

const convertDateComparteNow = (time: string) => {
    const userTimeZoneOffset = getUserTimeZoneOffset();
    console.log(userTimeZoneOffset, time)
    const localTime = moment(time, 'YYYY-MM-DD HH:mm:ss.SSSSSS').utc(userTimeZoneOffset as any); // Cộng thêm offset
    return localTime.fromNow();
};
export default { convertDateComparteNow };