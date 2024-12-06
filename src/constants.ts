// 使用正则表达式匹配.mp4链接
export const mp4Regex = /https?:[^\s"']+sns-video[^\s"']+/g;

// 使用正则表达式匹配《》标签内容
export const titleRegex = /《(.*?)》/;

export const outputDirectory = "./downloads";

export const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
