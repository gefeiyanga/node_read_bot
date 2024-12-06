import CloudConvert from "cloudconvert";
import {
  titleRegex,
  outputDirectory,
  mobileUserAgent,
} from "./constants";
import { JSDOM } from "jsdom";

export const getMp4 = async (url: string | null) => {
  async function scrapeHtml(url: string) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": mobileUserAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
        },
      });
      const html = await response.text();

      const { window } = new JSDOM(html, {
        runScripts: "dangerously",
        resources: "usable",
      });
      // console.log(
      //   "window.__SETUP_SERVER_STATE__:",
      //   JSON.stringify(window.__SETUP_SERVER_STATE__)
      // );
      let { title: fileName, video, desc } = window.__SETUP_SERVER_STATE__
        ?.LAUNCHER_SSR_STORE_PAGE_DATA?.noteData;
      fileName = (fileName || desc)?.match(titleRegex)?.[1] || fileName || desc;

      const { masterUrl: mp4Link } = video?.media?.stream?.h264?.[0] || {
        masterUrl: "",
      };

      if (mp4Link) {
        console.log(`找到${fileName}.mp4链接: ${mp4Link}`);
        return {
          fileName,
          url: mp4Link,
        };
      } else {
        console.log("未找到.mp4链接");
        return {
          fileName,
          url: "",
        };
      }
    } catch (error) {
      console.error("Error scraping HTML:", error);
      return {
        fileName: "",
        url: "",
      };
    }
  }
  // 使用示例
  // const targetUrl =
  //   "https://www.xiaohongshu.com/discovery/item/64df3a57000000000301df53?app_platform=ios&app_version=8.23&share_from_user_hidden=true&xsec_source=app_share&type=video&xsec_token=CBQqjMUBuG4iBy_8XLtKBGdBP9L7kFjU2n_j0JowHYiXk=&author_share=1&xhsshare=WeixinSession&appuid=597849ad5e87e7647ffd8cbb&apptime=1725887659";

  const mp4File = await scrapeHtml(url ?? "");
  return mp4File;
};

export const convertToMp3 = async (mp4File: {
  fileName: string;
  url: string | undefined;
}) => {
  const url = mp4File.url || "";
  const cloudConvert = new CloudConvert(process.env.API_KEY || "");
  let job = await cloudConvert.jobs.create({
    tasks: {
      "import-my-file": {
        operation: "import/url",
        url,
      },
      "convert-my-file": {
        operation: "convert",
        input: "import-my-file",
        output_format: "mp3",
      },
      "export-my-file": {
        operation: "export/url",
        input: "convert-my-file",
      },
    },
  });
  job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

  const file = cloudConvert.jobs.getExportUrls(job)[0];

  console.log("file: ", file);
  return file;
};

// export const downloadMp3 = (mp3File: any, fileName: string) => {

//   async function downloadFile(mp3File:any, fileName: string, outputPath: string) {
//     try {
//       console.log(`开始下载: ${mp3File?.url}`);

//       // 发送 GET 请求获取文件
//       const response = await fetch(mp3File?.url);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // 获取文件名
//       const filename = fileName
//         ? fileName + ".mp3"
//         : "downloaded_file.mp3";

//       // 构建完整的输出路径
//       const fullPath = join(outputPath, filename);

//       // 将响应内容写入文件
//       await Bun.write(fullPath, await response.arrayBuffer());

//       console.log(`文件已下载到: ${fullPath}`);
//       return fullPath;
//     } catch (error) {
//       console.error("下载文件时出错:", error);
//       throw error;
//     }
//   }

//   downloadFile(mp3File, fileName, outputDirectory)
//     .then((path) => console.log(`下载完成: ${path}`))
//     .catch((error) => console.error("下载失败:", error));
// }
