
/*********************************************************************
 *  Plugin to upload all static files/assets (JS,CSS etc) to S3 bucket
 *********************************************************************/

/**********************************************
 *           External npm modules
 ***********************************************/

const walk = require('walk');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const mime = require('mime');


//Function to push error to compilation error array 
const compileError = (compilation, error) => {
    compilation.errors.push(new Error(error))
}

class S3UploadAssetsPlugin {
    constructor(uploadOptions = {}) {
        this.uploadOptions = uploadOptions;
        
        //Adding config for aws
        const s3config = {
            "accessKeyId" : this.uploadOptions.accessKeyId,
            "secretAccessKey" : this.uploadOptions.secretAccessKey,
            "region" : this.uploadOptions.region
        }      
        //Construct a S3 object        
        this.s3Obj = new S3(s3config);
    }
    apply(compiler) {
        compiler.plugin('after-emit', (compilation,callback) => {
            // Get all files to upload to s3
            this.getAllFilesToUpload()
            .then((files) => {
                // Upload all files
                return this.uploadAssets(files);
            }).then(()=>{
                console.log("\nUploaded all files Successfully\n");
                callback()
            })
            .catch((error) => {
                //Push error to compliation errors Array
                compileError(compilation, `S3UploadAssetsPlugin: ${error}`)
                callback();
            });
        });
    }
    // Get all files to upload to s3
    getAllFilesToUpload() {
        return new Promise((resolve, reject) => {
            const files   = [];
            // Get all files in dist folder
            const walker  = walk.walk(this.uploadOptions.directory , { followLinks: false });
        
            walker.on('file', (root, stat, next) => {
                //Replace "//" present in root param
                root = root.replace(/\\/g, "/");
                if(stat.name.indexOf('index.html') == -1) {
                    // Add this file to the list of files
                    files.push(root + '/' + stat.name);
                }

                next();
            });

            walker.on("errors", function (root, stat, next) {
                reject(stat.error)
            });
            // Return all the files in directory
            walker.on('end', () => {      
                resolve(files);
            });
        });
    }
    //Upload all files to s3
    uploadAssets(files) {
        return new Promise((resolve, reject) => {
            const promises = [];
            //Call uploadAsset function for each file
            files.forEach((file) => {
                promises.push(this.uploadAsset(file));
            })
            Promise.all(promises).then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error); 
            });
        });
    }
    //Upload a particular file
    uploadAsset(file) {
        return new Promise( (resolve, reject) => {
            //Create readstream of the file
            const fileStream = fs.createReadStream(file);
            // Check if there is an error on the file
            fileStream.on('error', (error) => {
              if (error) { 
                reject(error); 
              }
            });
            
            fileStream.on('open',  () => {
                let cacheControl = 'public, max-age=31536000';
                if(file.indexOf('.html') != -1 || file.indexOf('.json') != -1) {
                    cacheControl = 'public, max-age=0';
                }
                // Upload Params
                const uploadParams = { 
                    Bucket: this.uploadOptions.bucket, 
                    Key: file.split(/\/(.+)/)[1], //Remove the base directory from key
                    Body: fileStream, 
                    ContentType : mime.getType(file),
                    CacheControl : cacheControl
                };
                
                if(this.uploadOptions.versioningTimestamp) {
                    uploadParams.Key = this.uploadOptions.versioningTimestamp + '/' + uploadParams.Key;
                }
                
                if(this.uploadOptions.appFolder) {
                    uploadParams.Key = this.uploadOptions.appFolder + '/' + uploadParams.Key;
                }

                // Uploading the file to the bucket
                this.s3Obj.putObject(uploadParams,  (error) => {
                    if (error) { 
                        reject(error); 
                    }
                    // Console the file which is being uploaded
                    else { 
                        console.log("Uploading asset " + file); 
                        resolve();
                    }
                    // Closing the stream to avoid leaks and socket timeouts
                    fileStream.close();
                });
            });
          });
    }
}

module.exports = S3UploadAssetsPlugin;
