// yaha pr ham prisma client banayange 
// jab bhi hamara server reload hota hai tho ek naya prisma client banata hai and uski vajah se multiple client ho jayenge jisse bachne ke liye hamne ye method ka use kiya hai 

// import {PrismaClient} from "@prisma/client" -- this is used when the schema is generatign in the default location 
// '../generated/prisma/index.js' ki jagah ye rasta try kar
import { PrismaClient } from '../generated/prisma/client.js'

const globalforprisma = globalThis

export const db = globalforprisma.prisma || new PrismaClient()

if(process.env.NODE_ENV !=  "Production") globalforprisma.prisma = db 


