// textUtils.js
export const trimText = (text, maxLength = 200) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
  