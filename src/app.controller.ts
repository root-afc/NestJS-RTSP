import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { exec } from 'child_process';
import { error } from 'node:console';
import { stdout } from 'process';
import { stderr } from 'node:process';
import { AwsService } from './aws.service';
import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
    bucket = '5e805f2f-de7d-4a83-863f-2cb15d46803f';
    constructor(private readonly appService: AppService, private readonly awsService: AwsService) {
        this.awsService.configLoad();
    }

    @Get('record')
    Record(): Promise<string> {
        var rndname = `${new Date().getTime().toString()}.mp4`;
        var command = `ffmpeg -i "rtsp://admin:5L90gBdPUwmc@200.12.252.238:554/cam/realmonitor?channel=1&subtype=0" -t 00:00:10 temp/${rndname}`;

        console.log('recording...');

        return new Promise((resolve, reject) => {

            exec(command, async (error, stdout, stderr) => {

                console.log('uploading...');
                const s3 = new S3();

                const filecontent = readFileSync(`temp/${rndname}`);
                await s3.putObject({ Bucket: this.bucket, Key: rndname, Body: filecontent }, (error, data) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(data);
                    }
                }).promise();

                console.log('done...');
                resolve('done');
            });
        });
    }

    @Get('objectlist')
    async getAws(): Promise<any[]> {
        let list = [];
        const s3 = new S3();
        await s3.listObjects({ Bucket: this.bucket }, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                list = data.Contents.map((value) => {
                    //console.log(value);
                    return value;
                });
            }
        }).promise();
        return list;
    }


}
