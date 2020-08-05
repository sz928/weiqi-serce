#! /bin/bash
cd ../proto
outPath="../libs/proto/"
temp='../temp'

mkdir -p $temp

if [ -d "$outPath" ]; then
    `rm -fr $outPath/*`
else
    # echo "文件夹不存在"
    mkdir -p $outPath
fi

function read_dir() {
    for file in $(#注意此处这是两个反引号，表示运行系统命令
        ls $1
    ); do
        if [ -d $1"/"$file ]; then #注意此处之间一定要加上空格，否则会报错
            read_dir $1"/"$file
        else
            # echo $1"/"$file #在此处处理文件即可
            filename=${file%.*}
            #生成*.js
            `pbjs -t static-module --es6 -w commonjs -o $temp"/"$filename.js $file`
            #*生成.d.ts
            `pbts -o $outPath"/"$filename.d.ts $temp"/"$filename.js`
            #替换第一行
            `sed -i '1c import * as $protobuf from "./protobuf";' $outPath"/"$filename.d.ts`
        fi
    done
}
#读取第一个参数
read_dir $1

`rm -fr $temp`

echo "完成"
