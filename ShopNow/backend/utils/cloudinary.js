import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

// Load environment variables from the config file
dotenv.config({ path: "backend/config/config.env"});

//Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


//Upload an image
export const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            (result) => {
                resolve({
                    public_id: result.public_id,
                    url: result.url
                });
            },
            {
                resource_type: "auto",
                folder,
            }
        );
    });
};

//delete file
export const delete_file = async (file) => {
    const res = await cloudinary.uploader.destroy(file);

    if(res?.result === 'ok') return true;
}
