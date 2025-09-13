export function sliceUpload(file: any) {
    //    切片完成度
    const slices = [];
    // 单个切片的结果
    createChunk(file, 5 * 1024 * 1024)
}
// 计算切片
function createChunk(file: any, chunkSize: number) {
    file.slices(0, chunkSize)
    return chunkSize;
}
export function readBase64(file: any) {
    const reader: FileReader = new FileReader()
    reader.onload = (e:any) => {
        const result = e.target.result;
        return result
    }
    reader.readAsDataURL(file)
}

/**
 * 计算文件大小并进行转换
 * @return {number}                   文件大小（字节）
 */
export function clacFileSize(size: any): string {
    if (size < 1024) {
        return size + 'B';
    } else if (size >= 1024 && size < Math.pow(1024, 2)) {
        return parseFloat(size / 1024).toFixed(2) + 'KB';
    } else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
        return parseFloat(size / Math.pow(1024, 2)).toFixed(2) + 'MB';
    } else if (size > Math.pow(1024, 3)) {
        return parseFloat(size / Math.pow(1024, 3)).toFixed(2) + 'GB';
    } else {
        return 0 + 'B';
    }
}

