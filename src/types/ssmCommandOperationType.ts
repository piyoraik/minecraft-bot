import { CommandInvocation } from '@aws-sdk/client-ssm'

export interface ssmCommandOperationRes {
  status: 0 | 1
  content: string
}
