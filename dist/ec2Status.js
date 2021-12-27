"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ec2Status = void 0;
const client_ec2_1 = require("@aws-sdk/client-ec2");
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
const provider = (0, credential_provider_node_1.defaultProvider)({});
const ec2Client = new client_ec2_1.EC2Client({
    region: 'ap-northeast-1',
    credentials: provider,
});
const INSTANCE_ID = process.env.INSTANCE_ID;
const ec2Status = (interaction, command) => __awaiter(void 0, void 0, void 0, function* () {
    if (command === 'START') {
        try {
            const data = yield ec2Client.send(new client_ec2_1.StartInstancesCommand({ InstanceIds: [INSTANCE_ID] }));
            interaction.followUp({ content: 'Success' });
            return data;
        }
        catch (err) {
            console.log(err);
            interaction.followUp({ content: 'Error' });
        }
    }
    else if (command === 'STOP') {
        try {
            const data = yield ec2Client.send(new client_ec2_1.StopInstancesCommand({ InstanceIds: [INSTANCE_ID] }));
            interaction.followUp({ content: 'Success' });
            return data;
        }
        catch (err) {
            console.log(err);
            interaction.followUp({ content: 'Error' });
        }
    }
});
exports.ec2Status = ec2Status;
