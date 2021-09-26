import { FileUpload } from 'graphql-upload';
import { v2 } from 'cloudinary';
import { RegularExpresssions } from '@/constants';

export const uploadFile = async (file: FileUpload): Promise<string> => {
    const { createReadStream } = await file;

    v2.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
    });

    const url: string = await new Promise((resolve, reject) => {
        createReadStream()
            .pipe(
                v2.uploader.upload_stream(
                    {
                        // tags: 'basic_sample',
                        // width: '300',
                        // height: '350',
                        // dpr: 'auto',
                        gravity: 'auto',
                        // crop: "fill_pad",
                        quality: 'auto',
                    },
                    function (err, image: any) {
                        if (err) {
                            return reject(err.message);
                        }
                        resolve(image.url);
                    },
                ),
            )
            .on('error', reject);

        // store image in file
        // const destinationPath = path.join(__dirname, '/../../images/', filename)
        // createReadStream()
        //     .on('readable', () => {
        //         let chunk;
        //         while( null !== (chunk = createReadStream().read())) {
        //             chunks.push(chunk);
        //         }
        //     })
        // .pipe(createWriteStream(destinationPath))
        // .on('error', rej)
        // .on('finish', () => {
        //     // Do your custom business logic
        //     res(destinationPath);
        //     // // Delete the tmp file uploaded
        //     // unlink(destinationPath, () => {
        //     //     res('your image url..')
        //     // })
        // })
    });

    return url;
};

export const deleteFile = async (url: string) => {
    let matchArr = RegularExpresssions.cloudinaryPublicId.exec(url);
    if (matchArr && matchArr[1]) {
        v2.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
        });
        let response = await v2.uploader.destroy(matchArr[1]);
        console.log(response);
        if (!(response && response.result === 'ok')) throw new Error('Image is not deleted');
    }
};

// const storeUpload = async (upload: any): Promise<FileField> => {
//     const { createReadStream } = upload;
//     const stream = createReadStream();
//     return new Promise((resolve, reject) =>
//         stream
//             .pipe(
//                 v2.uploader.upload_stream(
//                     {
//                         // tags: 'basic_sample',
//                         // width: '300',
//                         // height: '350',
//                         // dpr: 'auto',
//                         gravity: "auto",
//                         crop: "fill_pad",
//                         quality: "auto",
//                     },
//                     function (err, image: any) {
//                         if (err) {
//                             console.warn(err);
//                             return reject(err.message);
//                         }
//                         // console.log("* Same image, uploaded via stream");
//                         // console.log(image);
//                         // console.log("* " + image.url);
//                         resolve({
//                             path: image.url,
//                             uploadName: "",
//                             mimetype: "",
//                         });
//                     }
//                 )
//             )
//             .on("error", reject)
//     );
// };
// export const processMultiUpload = async (files) => {
//     let uploadedFiles = [];
//     uploadedFiles = await Promise.all(files.map(storeUpload));
//     return uploadedFiles;
// };
// export const processSingleUpload = async (upload): Promise<FileField> => {
//     upload = await upload;
//     const uploadedFile = await storeUpload(upload.file);
//     return uploadedFile;
// };
