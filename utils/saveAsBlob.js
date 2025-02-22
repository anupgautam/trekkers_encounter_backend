
const saveBlobAsImage = (blobData, fileName) => {
    const filePath = path.join(__dirname, 'images', fileName); // Specify the path where you want to save the image

    // Convert the Blob data to a Buffer
    const bufferData = Buffer.from(blobData, 'binary');

    // Write the Buffer data to a file
    fs.writeFileSync(filePath, bufferData);

    return filePath; // Return the path where the image is saved
}

module.exports = saveBlobAsImage;