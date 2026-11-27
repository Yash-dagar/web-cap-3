const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// { year: 2026, month: 7 } -> "Jul 2026"
export const monthName = (id) => {
    return MONTHS[id.month - 1] + ' ' + id.year;
};

// "2026-11-26T10:00:00.000Z" -> "26/11/2026"
export const formatDate = (date) => {
    if (!date) {
        return '-';
    }
    return new Date(date).toLocaleDateString('en-GB');
};
